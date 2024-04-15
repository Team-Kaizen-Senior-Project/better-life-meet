import { AbortError, ServiceError, fql } from 'fauna'
import { getHmsSessions } from '~/server/utils/hms'
import type {
	HmsSessions,
	HmsSessionsFilters,
	Meeting,
	MeetingSession,
	MeetingSessionList,
	MeetingSessionPeer,
	Pod,
} from '~/types'

export default defineEventHandler(async (event) => {
	// Initialize Fauna client
	const { client, error } = useFauna()
	if (error !== null) return error

	const filters = getQuery<Omit<HmsSessionsFilters, 'active'>>(event)

	try {
		const sessions: HmsSessions = await getHmsSessions(filters)

		// For each session, retreive the meeting by room ID.
		const meetings: MeetingSession[] = await Promise.all(
			sessions.data.map(async (session) => {
				let query = fql`let meeting = Meeting.firstWhere(.roomId == ${session.room_id});
				if (!meeting.exists()) abort({ message: "Meeting with this ID does not exist." });
				meeting;`
				let response = await client.query(query)

				const meeting = response.data as unknown as Meeting

				query = fql`let pod = Pod.byId(${meeting.podRef.id});
				if (!pod.exists()) abort({ message: "Pod with this ID does not exist." });
				pod;`
				response = await client.query(query)

				const pod = response.data as unknown as Pod

				//
				const peers = new Map<string, MeetingSessionPeer>()
				Object.values(session.peers).forEach((peer) => {
					if (peers.has(peer.name)) {
						const existingPeer = peers.get(peer.name)! // defined if true

						if (peer.left_at) {
							const duration = (Date.parse(peer.left_at) - Date.parse(peer.joined_at)) / 1000
							existingPeer.duration += Math.ceil(duration)
						}

						// Update for oldest joined_at
						existingPeer.joined_at =
							Date.parse(existingPeer.joined_at) < Date.parse(peer.joined_at) ? existingPeer.joined_at : peer.joined_at

						// Set if unset left_at
						if (peer.left_at && !existingPeer.left_at) {
							existingPeer.left_at = peer.left_at
						}
						// Update for newest left_at
						else if (peer.left_at && existingPeer.left_at) {
							existingPeer.left_at =
								Date.parse(existingPeer.left_at) < Date.parse(peer.left_at) ? peer.left_at : existingPeer.left_at
						}
					} else {
						const newPeer: MeetingSessionPeer = {
							name: peer.name,
							joined_at: peer.joined_at,
							left_at: peer.left_at,
							duration: 0,
							mic_duration: 0,
							video_duration: 0,
						}

						if (peer.left_at) {
							const duration = (Date.parse(peer.left_at) - Date.parse(peer.joined_at)) / 1000
							newPeer.duration = Math.ceil(duration)
						}

						peers.set(peer.name, newPeer)
					}
				})

				const meetingPeers = Array.from(peers, ([_, v]) => v)

				// For each peer, let's calculate how long they used their mic/video
				// Get track events by room ID
				const trackEvents = await getHmsEvents(meeting.roomId, 'remove', { limit: 100, session_id: session.id })
				meetingPeers.forEach((peer) => {
					const peerEvents = trackEvents.events.filter((event) => event.data.user_name === peer.name)
					peerEvents.forEach((event) => {
						const stopped_at = event.data.stopped_at! // defined since it's a successful remove event
						const started_at = event.data.started_at

						const subDuration = Math.ceil((Date.parse(stopped_at) - Date.parse(started_at)) / 1000)
						if (!event.data.mute) {
							if (event.data.type === 'audio') {
								peer.mic_duration += subDuration
							} else {
								peer.video_duration += subDuration
							}
						}
					})
				})

				return {
					id: meeting.id,
					pod_name: pod.name,
					active: session.active,
					start_time: meeting.startTime.isoString,
					end_time: meeting.endTime.isoString,
					time_zone: meeting.timeZone,
					peers: meetingPeers,
				}
			}),
		)

		const meetingSessionList: MeetingSessionList = {
			limit: sessions.limit,
			data: meetings,
			last: sessions.last,
		}

		return meetingSessionList
	} catch (error) {
		console.log(error)
		if (error instanceof AbortError) {
			const abortError = error as AbortError
			const abort = abortError.abort! as { message: string }
			throw createError({
				statusCode: abortError.httpStatus,
				statusMessage: abort.message,
			})
		} else {
			const serviceError = error as ServiceError
			throw createError({
				statusCode: serviceError.httpStatus,
				statusMessage: serviceError.message,
			})
		}
	}
})

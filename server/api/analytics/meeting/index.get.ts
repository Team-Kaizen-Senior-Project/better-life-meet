import { AbortError, ServiceError, fql } from 'fauna'
import { getHmsSessions } from '~/server/utils/hms'
import type { HmsSessions, HmsSessionsFilters, Meeting, Pod } from '~/types'
import type { MeetingSession, MeetingSessionList, MeetingSessionPeer } from '..'

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
						}

						if (peer.left_at) {
							const duration = (Date.parse(peer.left_at) - Date.parse(peer.joined_at)) / 1000
							newPeer.duration = Math.ceil(duration)
						}

						peers.set(peer.name, newPeer)
					}
				})

				return {
					id: meeting.id,
					podName: pod.name,
					active: session.active,
					startTime: meeting.startTime.isoString,
					endTime: meeting.endTime.isoString,
					timeZone: meeting.timeZone,
					peers: Array.from(peers, ([_, v]) => v),
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

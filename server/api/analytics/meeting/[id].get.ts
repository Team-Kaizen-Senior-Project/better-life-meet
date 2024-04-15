import { AbortError, ServiceError, fql } from 'fauna'
import type { Meeting, MeetingSession, MeetingSessionPeer, Pod } from '~/types'

// Endpoint for reading meeting given an Id
export default defineEventHandler(async (event) => {
	// Get Meeting ID
	const { id } = event.context.params as { id: string }

	// Initialize Fauna client
	const { client, error } = useFauna()
	if (error !== null) return error

	try {
		// Retrieve the meeting by ID in Fauna
		let query = fql`let meeting = Meeting.byId(${id});
		if (!meeting.exists()) abort({ message: "Meeting with this ID does not exist." });
		meeting;`
		let response = await client.query(query)

		const meeting = response.data as unknown as Meeting

		// Find the session(s) by room ID
		const roomId = meeting.roomId
		const sessions = await getHmsSessions({ room_id: roomId })

		// We assume there's only one session per room or throw an error if there is none
		const session = sessions.data[0]
		if (!session) {
			throw createError({
				statusCode: 404,
				statusMessage: 'Meeting not associated with a session.',
			})
		}

		query = fql`let pod = Pod.byId(${meeting.podRef.id});
		if (!pod.exists()) abort({ message: "Pod with this ID does not exist." });
		pod;`
		response = await client.query(query)

		const pod = response.data as unknown as Pod

		const meetingSession: MeetingSession = {
			id: meeting.id,
			pod_name: pod.name,
			start_time: meeting.startTime.isoString,
			end_time: meeting.endTime.isoString,
			time_zone: meeting.timeZone,
			peers: [],
		}

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

		meetingSession.peers = Array.from(peers, ([_, v]) => v)

		// For each peer, let's calculate how long they used their mic/video
		// Get track events by room ID
		// WARN: This may be inaccurate, as it only retrieves 100 track 'remove' events.
		const trackEvents = await getHmsEvents(roomId, 'remove', { limit: 100 })

		meetingSession.peers.forEach((peer) => {
			const peerEvents = trackEvents.events.filter((event) => event.data.user_name === peer.name)
			peerEvents.forEach((event) => {
				const stopped_at = event.data.stopped_at! // defined since it's a successful remove event
				const started_at = event.data.started_at

				const subDuration = Math.ceil((Date.parse(stopped_at) - Date.parse(started_at)) / 1000)
				if (event.data.type === 'audio') {
					peer.mic_duration += subDuration
				} else {
					peer.video_duration += subDuration
				}
			})
		})

		// Return query result
		return meetingSession
	} catch (error) {
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

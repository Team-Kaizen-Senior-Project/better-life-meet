import type { HMSPeer } from '@100mslive/hms-video-store/dist/internal'
import { AbortError, ServiceError, fql } from 'fauna'
import { getHmsSessions } from '~/server/utils/hms'
import type { HmsSessionsFilters, Meeting, Pod } from '~/types'

export default defineEventHandler(async (event) => {
	// Initialize Fauna client
	const { client, error } = useFauna()
	if (error !== null) return error

	const filters = getQuery<Omit<HmsSessionsFilters, 'active'>>(event)

	try {
		const sessions = await getHmsSessions(filters)

		// For each session, retreive the meeting by room ID.
		const meetings = await Promise.all(
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

				return {
					id: meeting.id,
					pod: pod.name,
					active: session.active,
					startTime: meeting.startTime.isoString,
					endTime: meeting.endTime.isoString,
					timeZone: meeting.timeZone,
					peers: session.peers,
				}
			}),
		)

		meetings.forEach((meeting) => {
			const peers = new Map()
			Object.values(meeting.peers).forEach((peer) => {
				if (!peers.has(peer.name)) {
					peers.set(peer.name, {
						joined_at: peer.joined_at,
						left_at: peer.left_at,
					})

					if (peer.left_at) {
						const duration = (Date.parse(peer.left_at) - Date.parse(peer.joined_at)) / 1000
						peers.get(peer.name).duration = Math.ceil(duration)
					}
				} else {
					if (peer.left_at) {
						const duration = (Date.parse(peer.left_at) - Date.parse(peer.joined_at)) / 1000
						peers.get(peer.name).duration += Math.ceil(duration)
					}

					// Update for oldest joined_at
					const seen = peers.get(peer.name)
					seen.joined_at = Date.parse(seen.joined_at) < Date.parse(peer.joined_at) ? seen.joined_at : peer.joined_at

					// Set if unset left_at
					if (peer.left_at && !seen.left_at) {
						seen.left_at = peer.left_at
					}
					// Update for newest left_at
					else if (peer.left_at && seen.left_at) {
						seen.left_at = Date.parse(seen.left_at) < Date.parse(peer.left_at) ? peer.left_at : seen.left_at
					}
				}
			})
			meeting.peers = Object.fromEntries(peers)
		})

		// well...
		// @ts-ignore
		sessions.data = meetings

		return sessions
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

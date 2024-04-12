import { AbortError, ServiceError, fql } from 'fauna'
import { getHmsSessions } from '~/server/utils/hms'
import type { HmsSessionsFilters, Meeting } from '~/types'

export default defineEventHandler(async (event) => {
	// Initialize Fauna client
	const { client, error } = useFauna()
	if (error !== null) return error

	const filters: HmsSessionsFilters = getQuery(event)

	console.log(filters)

	try {
		const sessions = await getHmsSessions(filters)

		// For each session, retreive the meeting by room ID.
		const meetings = await Promise.all(
			sessions.data.map(async (session) => {
				const query = fql`let meeting = Meeting.firstWhere(.roomId == ${session.room_id});
				if (!meeting.exists()) abort({ message: "Meeting with this ID does not exist." });
				meeting;`

				const response = await client.query(query)

				const meeting = response.data as unknown as Meeting

				return { ...session, ...meeting }
			}),
		)

		/**
		 * Reduce peers list by unique names
		 * TODO: Calculate total duration of seconds attended during meeting.
		 * TODO: Get oldest 'joined_at' and newest 'left_at'.
		 */
		meetings.forEach((meeting) => {
			const peers = meeting.peers
		})

		sessions.data = meetings

		return sessions
		// return room
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

import { AbortError, ServiceError, fql } from 'fauna'

// Interface for meeting
export interface Meeting {
	startTime: string
	endTime: string
	timeZone: string
	podRef: string
}

// Endpoint for creating a meeting
export default defineEventHandler(async (event) => {
	// Initialize Fauna client
	const { client, error } = useFauna()
	if (error !== null) return error
	// Create new meeting record and assign attendees
	try {
		const meeting = (await readBody(event)) as Meeting
		// Perform POST query for meeting
		const query = fql`
		let meeting = {
			startTime: ${meeting.startTime},
			endTime: ${meeting.endTime},
			timeZone: ${meeting.timeZone},
			podRef: Pod.byId(${meeting.podRef}),
		}
		Meeting.create(meeting)
		`

		const meetingDoc = await client.query(query)

		// Return meeting object
		return meetingDoc

		// Catch error
	} catch (error: unknown) {
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

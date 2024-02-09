import { AbortError, ServiceError, fql } from 'fauna'

// Endpoint for creating a meeting
export default defineEventHandler(async (event) => {
	// Initialize Fauna client
	const { client, error } = useFauna()
	if (error !== null) return error

	// Read in request body (use type assertion to validate body)
	const body = (await readBody(event)) as Body

	// Create new meeting record and assign attendees
	try {
		// Store meeting info into seperate object
		const meeting = {
			meetingId: body.meetingId,
			startTime: body.startTime,
			endTime: body.endTime,
		}
		// Perform POST query for meeting
		const query = fql`Meeting.create(${meeting})`
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

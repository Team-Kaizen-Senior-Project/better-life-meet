import { AbortError, ServiceError, fql } from 'fauna'

// Endpoint for deleting a meeting given an Id
export default defineEventHandler(async (event) => {
	// Get Meeting ID
	const { id } = event.context.params as { id: string }

	// Initialize Fauna client
	const { client, error } = useFauna()
	if (error !== null) return error

	try {
		// Perform READ query (print error if resource not found)
		const query = fql`let meeting = Meeting.byId(${id});
		if (!meeting.exists()) abort({ message: "Meeting with this ID does not exist." });
		meeting!.delete();`

		const response = await client.query(query)

		// Return query response
		return response
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

import { AbortError, ServiceError, fql } from 'fauna'
import type { Customer } from '~/types'

// Endpoint for reading meeting given an Id
export default defineEventHandler(async (event) => {
	// Get Meeting ID
	const { id } = event.context.params as { id: string }

	// Initialize Fauna client
	const { client, error } = useFauna()
	if (error !== null) return error

	try {
		// Perform READ query
		const query = fql`let meeting = Meeting.byId(${id});
		if (!meeting.exists()) abort({ message: "Meeting with this ID does not exist." });
		meeting;`

		const response = await client.query(query)

		// Return query result
		return response
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

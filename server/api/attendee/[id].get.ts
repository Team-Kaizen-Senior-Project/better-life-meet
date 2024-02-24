import { AbortError, ServiceError, fql } from 'fauna'

// Endpoint for reading attendee given an Customer Id or an Attendee Id
export default defineEventHandler(async (event) => {
	// Get ID from the URL params
	const { id } = event.context.params as { id: string }

	// Initialize Fauna client
	const { client, error } = useFauna()
	if (error !== null) return error

	try {
		const query = fql`
		let attendee = Attendee.byId(${id}); 
		if (!attendee.exists()) 
		abort({ message: "Attendee with this ID does not exist." });
		attendee;`
		const response = await client.query(query)

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

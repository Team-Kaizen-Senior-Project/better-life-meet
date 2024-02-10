import { AbortError, ServiceError, fql } from 'fauna'

// Endpoint for reading pod given an Id
export default defineEventHandler(async (event) => {
	// Extract id param from request query
	const { id } = event.context.params as { id: string }

	// Initialize Fauna client
	const { client, error } = useFauna()
	if (error !== null) return error

	try {
		// Perform READ query
		const query = fql`let pod = Pod.byId(${id});
		if (!pod.exists()) abort({ message: "Pod with this ID does not exist." });
		pod;`

		const response = await client.query(query)
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

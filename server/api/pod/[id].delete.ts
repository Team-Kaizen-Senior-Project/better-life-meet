import { AbortError, ServiceError, fql } from 'fauna'

// Endpoint for deleting a pod given an Id
export default defineEventHandler(async (event) => {
	// Initialize Fauna client
	const { client, error } = useFauna()
	if (error !== null) return error

	try {
		const { id } = event.context.params as { id: string }

		const query = fql`let pod = Pod.byId(${id});
		if (!pod.exists()) abort({ message: "Pod with this ID does not exist." });
		pod!.delete();`

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

import { AbortError, ServiceError, fql } from 'fauna'

// Endpoint for adding new meeting references for a pod
export default defineEventHandler(async (event) => {
	// Initialize Fauna client
	const { client, error } = useFauna()
	if (error !== null) return error

	try {
		// Get Pod ID
		const { id } = event.context.params as { id: string }
		const updatedPod = await readBody(event) //as String

		const query = fql`
        let pod = Pod.byId(${id})
		if (!pod.exists()) abort({ message: "Pod with this ID does not exist." });
    	pod!.update(${updatedPod});
    	`
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

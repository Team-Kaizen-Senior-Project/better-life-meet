import { AbortError, ServiceError, fql } from 'fauna'

// Endpoint for reading pod given an Id
export default defineEventHandler(async (event) => {
	// Get pod ID
	const { id } = event.context.params as { id: string }

	// Get the query parameters from the event object
	const idType = event.req.url
		? new URL(event.req.url, `http://${event.req.headers.host}`).searchParams.get('idType')
		: 'pod'

	// Initialize Fauna client
	const { client, error } = useFauna()
	if (error !== null) return error

	try {
		// Perform READ query
		const query = fql`let pod = Pod.byId(${id});
		if (!pod.exists()) abort({ message: "Pod with this ID does not exist." });
		pod{PodInfo: .data};`

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

import { AbortError, ServiceError, fql } from 'fauna'

// Endpoint for retrieving meetings
export default defineEventHandler(async (event) => {
	// Extract params from request query
	const { cursor, count, podId, allPods }: any = getQuery(event)

	// Initialize Fauna client
	const { client, error } = useFauna()
	if (error !== null) return error

	try {
		let query = fql`Meeting.all()`

		// Convert allPods to boolean
		const allPodsBool = allPods === 'true'

		// Adjust query based on the presence of allPods, podId, and pagination parameters
		if (allPodsBool) {
			if (count) {
				query = fql`Meeting.all().paginate(${Number(count)})`
			} else {
				query = fql`Meeting.all()`
			}
		} else if (podId) {
			// Check if count parameter is passed for pagination
			if (count) {
				query = fql`let pod = Pod.byId(${podId}); Meeting.where(.podRef == pod).paginate(${Number(count)})`
			} else {
				query = fql`let pod = Pod.byId(${podId}); Meeting.where(.podRef == pod).paginate()`
			}
		} else if (count) {
			// Default
			query = fql`Meeting.all().paginate(${Number(count)})`
		}

		// Apply cursor for pagination if provided
		if (cursor) {
			query = fql`Set.paginate(${cursor})`
		}

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

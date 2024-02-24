import { AbortError, ServiceError, fql } from 'fauna'

// Endpoint for retrieving all meetings
export default defineEventHandler(async (event) => {
	// Extract params from request query
	const { cursor, count, podId }: any = getQuery(event)

	// Intitialize Fauna client
	const { client, error } = useFauna()
	if (error !== null) return error

	try {
		// Default Query
		let query = fql`Meeting.all().paginate()`

		// Check to see if client is making a paginated request
		if (cursor) {
			if (count) {
				query = fql`Set.paginate(${cursor}, ${Number(count)})`
			} else {
				query = fql`Set.paginate(${cursor})`
			}
		} else if (podId) {
			// Check if count parameter is passed for pagination
			if (count) {
				query = fql`let pod = Pod.byId(${podId}); Meeting.where(.podRef == pod).paginate(${Number(count)})`
			} else {
				query = fql`let pod = Pod.byId(${podId}); Meeting.where(.podRef == pod).paginate()`
			}
		} else if (count) {
			query = fql`Meeting.all().paginate(${Number(count)})`
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

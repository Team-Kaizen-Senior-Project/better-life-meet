import { AbortError, ServiceError, fql } from 'fauna'

export default defineEventHandler(async (event) => {
	// Extract params from request query
	const { cursor, count, podRef }: { cursor: string; count: string; podRef: string } = getQuery(event)

	// Initialize Fauna client
	const { client, error } = useFauna()
	if (error !== null) return error

	try {
		// Default query
		let query = fql`Customer.all().paginate()`

		// Check to see if client is making a paginated request
		if (cursor !== undefined && count !== undefined) {
			query = fql`Set.paginate(${cursor}, ${Number(count)})`
		} else if (cursor !== undefined) {
			query = fql`Set.paginate(${cursor})`
		} else if (podRef !== undefined) {
			// Check if count parameter is passed for pagination
			if (count !== undefined) {
				query = fql`let pod = Pod.byId(${podRef})
				Customer.where(.podRef == pod).paginate(${Number(count)})`
			} else {
				query = fql`let pod = Pod.byId(${podRef})
				Customer.where(.podRef == pod).paginate()`
			}
		} else if (count !== undefined) {
			query = fql`Customer.all().paginate(${Number(count)})`
		}

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

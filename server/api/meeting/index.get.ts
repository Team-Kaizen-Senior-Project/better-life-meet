import { AbortError, ServiceError, fql } from 'fauna'

// Endpoint for retrieving all meetings
export default defineEventHandler(async (event) => {
	// Initialize Fauna client
	const { cursor, count }: { cursor: string | undefined; count: string | undefined } = getQuery(event)

	// Intitialize Fauna client
	const { client, error } = useFauna()
	if (error !== null) return error

	try {
		// Perform READ query
		let query = fql`{Meeting.all(){id, data}}`

		if (cursor !== undefined && count !== undefined) {
			query = fql`Set.paginate(${cursor}, ${Number(count)})`
		} else if (cursor !== undefined) {
			query = fql`Set.paginate(${cursor})`
		} else if (count !== undefined) {
			query = fql`{Meeting.all(){id, data}}.paginate(${Number(count)})`
		}

		const response = await client.query(query)

		// Return query response
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

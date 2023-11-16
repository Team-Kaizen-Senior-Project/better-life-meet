import { AbortError, ServiceError, fql } from 'fauna'

export default defineEventHandler(async (event) => {
	// Get Customer ID
	const { id } = event.context.params as { id: string }
	const { cursor, count }: { cursor: string | undefined; count: string | undefined } = getQuery(event)

	// Initialize Fauna client
	const { client, error } = useFauna()
	if (error !== null) return error

	try {
		let query = fql`Customer.all().paginate()`

		if (cursor !== undefined && count !== undefined) {
			query = fql`Set.paginate(${cursor}, ${Number(count)})`
		} else if (cursor !== undefined) {
			query = fql`Set.paginate(${cursor})`
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

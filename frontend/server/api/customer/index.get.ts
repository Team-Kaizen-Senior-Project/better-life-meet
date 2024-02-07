import { AbortError, ServiceError, fql } from 'fauna'

export default defineEventHandler(async (event) => {
	const { cursor, count }: { cursor: string | undefined; count: string | undefined } = getQuery(event)

	// Initialize Fauna client
	const { client, error } = useFauna()
	if (error !== null) return error

	try {
		// Extract query params for external Refs (may not exist, so default to undefined)
		const podRef = event.req.url
			? new URL(event.req.url, `http://${event.req.headers.host}`).searchParams.get('podRef')
			: undefined

		// Default query
		let query = fql`Customer.all().paginate()`

		// Check to see if client is making a paginated request
		if (cursor !== undefined && count !== undefined) {
			query = fql`Set.paginate(${cursor}, ${Number(count)})`
		} else if (cursor !== undefined) {
			query = fql`Set.paginate(${cursor})`
		} else if (count !== undefined) {
			// Apply additional filter if podRef exists, otherwise paginate without
			query = podRef
				? fql`let pod = Pod.byId(${podRef}); Customer.where(.podRef == pod).paginate(${Number(count)});`
				: fql`Customer.all().paginate(${Number(count)})`
		} else if (podRef !== undefined) {
			query = fql`let pod = Pod.byId(${podRef})
			Customer.where(.podRef == pod).paginate()`
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

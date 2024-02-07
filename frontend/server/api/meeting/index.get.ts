import { AbortError, ServiceError, fql } from 'fauna'

// Endpoint for retrieving all meetings
export default defineEventHandler(async (event) => {
	// Initialize Fauna client
	const { cursor, count }: { cursor: string | undefined; count: string | undefined } = getQuery(event)

	// Intitialize Fauna client
	const { client, error } = useFauna()
	if (error !== null) return error

	try {
		// Extract query params for external Refs (may not exist, so default to undefined)
		const podRef = event.req.url
			? new URL(event.req.url, `http://${event.req.headers.host}`).searchParams.get('podRef')
			: undefined

		// Default Query
		let query = fql`Meeting.all().paginate()`

		if (cursor !== undefined && count !== undefined) {
			query = fql`Set.paginate(${cursor}, ${Number(count)})`
		} else if (cursor !== undefined) {
			query = fql`Set.paginate(${cursor})`
		} else if (count !== undefined) {
			// Apply additional filter if PodRef exists, otherwise paginate without
			query = podRef
				? fql`let pod = Pod.byId(${podRef}); Meeting.where(.podRef == pod).paginate(${Number(count)});`
				: fql`Meeting.all().paginate(${Number(count)})`
		} else if (podRef !== undefined) {
			query = fql`let pod = Pod.byId(${podRef}); Meeting.where(.podRef == pod).paginate()`
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

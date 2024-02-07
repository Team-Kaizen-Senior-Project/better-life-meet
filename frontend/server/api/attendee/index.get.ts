import { AbortError, ServiceError, fql } from 'fauna'

// Endpoint for retrieving all attendees
export default defineEventHandler(async (event) => {
	const { cursor, count }: { cursor: string | undefined; count: string | undefined } = getQuery(event)

	// Initialize Fauna client
	const { client, error } = useFauna()
	if (error !== null) return error

	try {
		// Extract query params for external Refs (may not exist, so default to undefined)
		const customerRef = event.req.url
			? new URL(event.req.url, `http://${event.req.headers.host}`).searchParams.get('customerRef')
			: undefined
		const meetingRef = event.req.url
			? new URL(event.req.url, `http://${event.req.headers.host}`).searchParams.get('meetingRef')
			: undefined

		// Default query
		let query = fql`Attendee.all().paginate()`
		const document = await client.query(query)
		return document.data

		// Check to see if client is making a paginated request
		if (cursor !== undefined && count !== undefined) {
			query = fql`Set.paginate(${cursor}, ${Number(count)})`
		} else if (cursor !== undefined) {
			query = fql`Set.paginate(${cursor})`
		} else if (customerRef !== undefined || meetingRef !== undefined) {
			// Apply query param as filter
			const filterFied = customerRef !== undefined ? 'customerRef' : 'meetingRef'
			const filterValue = customerRef !== undefined ? customerRef : meetingRef
			const filterObject =
				customerRef !== undefined ? fql`Customer.byId(${filterValue})` : fql`Meeting.byId(${filterValue})`

			const filterClause = fql`.${filterFied} == ${filterObject}`

			query =
				count !== undefined
					? fql`let filteredAttendees = ${filterObject};
				Attendee.where(${filterClause}).paginate(${Number(count)})`
					: fql`let filteredAttendees = ${filterObject};
				Attendee.where(${filterClause}).paginate()`
		} else {
			query = count !== undefined ? fql`Attendee.all().paginate(${Number(count)})` : fql`Attendee.all().paginate()`
		}

		// Perform query and store doc
		//const document = await client.query(query)

		// Return query result
		//return document.data
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

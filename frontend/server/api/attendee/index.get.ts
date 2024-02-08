import { AbortError, ServiceError, fql } from 'fauna'

// Endpoint for retrieving all attendees
export default defineEventHandler(async (event) => {
	// Extract params from request query
	const {
		cursor,
		count,
		customerRef,
		meetingRef,
	}: { cursor: string; count: Number; customerRef: string; meetingRef: string } = getQuery(event)

	// Initialize Fauna client
	const { client, error } = useFauna()
	if (error !== null) return error

	try {
		// Default query
		let query = fql`Attendee.all().paginate()`

		// Check to see if client is making a paginated request
		if (cursor !== undefined && count !== undefined) {
			query = fql`Set.paginate(${cursor}, ${Number(count)})`
		} else if (cursor !== undefined) {
			query = fql`Set.paginate(${cursor})`
		} else if (customerRef !== undefined) {
			// Check if count parameter is passed for pagination
			if (count) {
				query = fql`let customer = Customer.byId(${customerRef}); Attendee.where(.customerRef == customer).paginate(${Number(
					count,
				)})`
			} else {
				query = fql`let customer = Customer.byId(${customerRef}); Attendee.where(.customerRef == customer).paginate()`
			}
		} else if (meetingRef !== undefined) {
			if (count) {
				query = fql`let meeting = Meeting.byId(${meetingRef}); Attendee.where(.meetingRef == meeting).paginate(${Number(
					count,
				)})`
			} else {
				query = fql`let meeting = Meeting.byId(${meetingRef}); Attendee.where(.meetingRef == meeting).paginate()`
			}
		} else if (count !== undefined) {
			query = fql`Attendee.all().paginate(${Number(count)})`
		}

		const document = await client.query(query)
		return document.data
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

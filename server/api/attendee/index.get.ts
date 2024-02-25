import { AbortError, ServiceError, fql } from 'fauna'

// Endpoint for retrieving all attendees
export default defineEventHandler(async (event) => {
	// Extract params from request query
	const { cursor, count, customerId, meetingId }: any = getQuery(event)

	// Initialize Fauna client
	const { client, error } = useFauna()
	if (error !== null) return error

	try {
		// Default query
		let query = fql`Attendee.all().paginate()`

		// Check to see if client is making a paginated request
		if (cursor) {
			if (count) {
				query = fql`Set.paginate(${cursor}, ${Number(count)})`
			} else {
				query = fql`Set.paginate(${cursor})`
			}
		} else if (customerId) {
			// Check if count parameter is passed for pagination
			if (count) {
				query = fql`let customer = Customer.byId(${customerId}); Attendee.where(.customerRef == customer).paginate(${Number(
					count,
				)})`
			} else {
				query = fql`let customer = Customer.byId(${customerId}); Attendee.where(.customerRef == customer).paginate()`
			}
		} else if (meetingId) {
			if (count) {
				query = fql`let meeting = Meeting.byId(${meetingId}); Attendee.where(.meetingRef == meeting).paginate(${Number(
					count,
				)})`
			} else {
				query = fql`let meeting = Meeting.byId(${meetingId}); Attendee.where(.meetingRef == meeting).paginate()`
			}
		} else if (count) {
			query = fql`Attendee.all().paginate(${Number(count)})`
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

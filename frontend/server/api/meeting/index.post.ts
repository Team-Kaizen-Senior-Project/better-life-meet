import { AbortError, ServiceError, fql } from 'fauna'

// Endpoint for creating a meeting
export default defineEventHandler(async (event) => {
	// Initialize Fauna client
	const { client, error } = useFauna()
	if (error !== null) return error

	// Read in request body (use type assertion to validate body)
	const body = (await readBody(event)) as Body

	// Store customerRef IDs
	const customerRefs: string[] = body.customerRefs

	// Initialize array to store the created attendeeRefs
	let attendeeRefs = []

	// Create new meeting record and assign attendees
	try {
		// Iterates through customerRefs and creates blank attendee records for each customer
		for (let i = 0; i < customerRefs.length; i++) {
			// Create attendee object using customer Id
			const query = fql`Attendee.create({customerRef: Customer.byId(${customerRefs[i]})})`
			const attendeeDoc = await client.query(query)

			// Store reference to newly created attendee object (utilized later to update meeting)
			const attendee = {
				customerRef: attendeeDoc.data?.id,
			}
			// push newly created attendees
			attendeeRefs.push(attendee)
		}

		// Store meeting info into seperate object
		const meeting = {
			meetingId: body.meetingId,
			startTime: body.startTime,
			endTime: body.endTime,
		}
		// Perform POST query for meeting
		const query = fql`Meeting.create(${meeting})`
		const meetingDoc = await client.query(query)

		// Retrieve meeting Id from query (used to update meeting object with attendee info)
		const meetingId = meetingDoc.data?.id

		// Query to update meeting to include attendee info
		const updateQuery = fql`Meeting.byId(${meetingId})!.update({attendeeRefs: ${attendeeRefs}.map(Attendee.create)})`
		const updatedDoc = await client.query(updateQuery)

		// Return the updated document (meeting + attendies)
		return updatedDoc

		// Catch error
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

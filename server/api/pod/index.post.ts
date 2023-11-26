import { AbortError, ServiceError, fql } from 'fauna'

// Body interface (read from POST request)
interface Body {
	name: string
	leader: string
	meetingTime: string
	members: string[]
	meetings: string[]
}

// Endpoint for creating a pod
export default defineEventHandler(async (event) => {
	// Initialize Fauna client
	const { client, error } = useFauna()
	if (error !== null) return error

	// Read in request body (use type assertion to validate body)
	const body = (await readBody(event)) as Body

	// Store customer IDs
	const members: string[] = body.members

	// Create new meeting record and assign attendees
	try {
		// Store pod info into seperate object
		const Pod = {
			name: body.name,
			meetingTime: body.meetingTime,
		}
		// Perform POST query for meeting
		const query = fql`Pod.create(${Pod})`
		const podDoc = await client.query(query)

		// Retrieve pod Id from query (used to update pod object with customer info)
		const podId = podDoc.data?.id

		// Query to update pod to include leader and member customerRefs
		const updateQuery = fql`Pod.byId(${podId})!.update({leader: Customer.byId(${body.leader}), members: ${members}.map(Customer.byId), meetings: []})`
		const updatedDoc = await client.query(updateQuery)

		// Return the updated document
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

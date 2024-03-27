import { AbortError, ServiceError, fql } from 'fauna'

// Endpoint for deleting a meeting given an Id
export default defineEventHandler(async (event) => {
	// Get Meeting ID
	const { id } = event.context.params as { id: string }

	// Initialize Fauna client
	const { client, error } = useFauna()
	if (error !== null) return error

	try {
		// Generate a management token
		const managementToken = await generateManagementToken()

		// Perform READ query to get meeting details, including roomId
		const meetingQuery = fql`let meeting = Meeting.byId(${id});
		if (!meeting.exists()) abort({ message: "Meeting with this ID does not exist." });
		meeting;`

		const meetingResponse = await client.query(meetingQuery)
		if (!meetingResponse.data) {
			throw new Error('Meeting not found.')
		}

		const roomId = meetingResponse.data.roomId // Accessing roomId from the response

		if (roomId) {
			// Disable the room on 100ms
			const resp = await fetch(`https://api.100ms.live/v2/rooms/${roomId}`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${managementToken}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ enabled: false }),
			})
			console.log(resp)
		}

		// Perform READ query (print error if resource not found)
		const query = fql`let meeting = Meeting.byId(${id});
		if (!meeting.exists()) abort({ message: "Meeting with this ID does not exist." });
		meeting!.delete();`

		const response = await client.query(query)

		// Return query response
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

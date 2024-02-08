import { fql } from 'fauna'

// Endpoint for reading attendee given an Customer Id or an Attendee Id
export default defineEventHandler(async (event) => {
	// Get ID from the URL params
	const { id } = event.context.params as { id: string }

	// Initialize Fauna client
	const { client, error } = useFauna()
	if (error !== null) return error

	try {
		let query = fql`let attendee = Attendee.byId(${id});
		if (!attendee.exists()) abort({message: "Attendee with this ID does not exist." })
		attendee`
		const document = await client.query(query)

		// Return 'Not found' 404 if document is empty
		if (document.data == null) {
			return createError({
				statusCode: 404,
				statusMessage: 'Resource Not Found',
			})
		}

		// Return query result
		return document.data
	} catch (error) {
		console.log(error)

		// Throw Server error for all other errors
		return createError({
			statusCode: 500,
			statusMessage: 'Internal Error Occurred',
		})
	}
})

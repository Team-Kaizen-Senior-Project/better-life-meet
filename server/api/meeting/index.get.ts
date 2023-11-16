import { fql } from 'fauna'

// Endpoint for retrieving all meetings
export default defineEventHandler(async (event) => {
	// Initialize Fauna client
	const { client, error } = useFauna()
	if (error !== null) return error

	try {
		// Perform READ query
		const query = fql`Meeting.all(){data}`
		const document = await client.query(query)

		// Return 'Not found' 404 if document is empty
		if (!document.data) {
			return createError({
				statusCode: 404,
				statusMessage: 'Resource Not Found',
			})
		}

		// Return query result
		return document.data
	} catch (error) {
		// Throw Server error for all other errors
		return createError({
			statusCode: 500,
			statusMessage: 'Internal Error Occurred',
		})
	}
})

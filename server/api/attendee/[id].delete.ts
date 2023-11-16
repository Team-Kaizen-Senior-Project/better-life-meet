import { fql } from 'fauna'

// Endpoint for deleting a attendee given an Id
export default defineEventHandler(async (event) => {
	// Get Attendee ID
	const { id } = event.context.params as { id: string }

	// Initialize Fauna client
	const { client, error } = useFauna()
	if (error !== null) return error

	try {
		// Perform READ query
		const query = fql`Attendee.byId(${id})!.delete`
		const document = await client.query(query)

		// Return query result
		return document.data
	} catch (error) {
		console.error(error)
	}
})

import { fql } from 'fauna'

// Endpoint for reading attendee given an Custoemr Id
export default defineEventHandler(async (event) => {
	// Get ID from the URL params
	const { id } = event.context.params as { id: string }

	// Get the query parameters from the event object
	const idType = event.req.url
		? new URL(event.req.url, `http://${event.req.headers.host}`).searchParams.get('idType')
		: 'customer'

	// Initialize Fauna client
	const { client, error } = useFauna()
	if (error !== null) return error

	try {
		let query = fql``
		// If idType is 'attendee', then query Attendee by Id
		if (idType == 'attendee') {
			query = fql`Attendee.byId(${id}){data}`
		}

		// If idType is 'customer', then query Attendee by Customer Id
		else if (idType == 'customer') {
			query = fql`Attendee.all().where(.customerRef == Customer.byId(${id}))`
		}
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

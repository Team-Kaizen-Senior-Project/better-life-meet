import { AbortError, ServiceError, fql } from 'fauna'

export default defineEventHandler(async (event) => {
	// Read customer email from POST in catch all route([...].ts)

	const body = await readBody(event)
	const email = body.email

	// Initialize Fauna client
	const { client, error } = useFauna()
	if (error !== null) return error

	try {
		let customerDetails = null
		const query = fql`Customer.where(.email==${email})`
		const response = await client.query(query)
		if (response) {
			const customerData = response.data.data[0]
			customerDetails = {
				id: customerData['id'],
				email: customerData['email'],
				firstName: customerData['firstName'],
				lastName: customerData['lastName'],
				netWorth: customerData['netWorth'],
			}
		}
		return customerDetails
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

import { AbortError, ServiceError, fql } from 'fauna'
import { useApi } from '~/composables/useApi'
import type { Customer } from '~/types'

// Extract getCustomerByEmail() function for conducting query
const { getCustomerByEmail } = useApi()

export default defineEventHandler(async (event: any): Promise<Customer | Error> => {
	const body = (await readBody(event)) as Customer
	const email = body.email

	// Initialize Fauna client
	const { client, error } = useFauna()
	if (error !== null) return error

	try {
		// Query by customer email
		const customerDetails = (await getCustomerByEmail(email)) as Customer
		// Return query result
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

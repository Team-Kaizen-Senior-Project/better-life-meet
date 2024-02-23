import { AbortError, ServiceError, fql } from 'fauna'
import type { Customer } from '~/types'

export default defineEventHandler(async (event) => {
	// Initialize Fauna client
	const { client, error } = useFauna()
	if (error !== null) return error

	try {
		const customer = (await readBody(event)) as Omit<Customer, 'id'>

		const query = fql`
			let customer = {
				firstName: ${customer.firstName},
				lastName: ${customer.lastName},
				email: ${customer.email},
				netWorth: ${customer.netWorth},
				podRef: Pod.byId(${String(customer.podRef)})
			};
			Customer.create(customer);

		`
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

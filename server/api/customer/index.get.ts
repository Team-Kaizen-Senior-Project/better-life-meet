import { AbortError, ServiceError, fql } from 'fauna'

export default defineEventHandler(async (event) => {
	// Extract params from request query
	const { cursor, count, podRef, email }: any = getQuery(event)

	// Initialize Fauna client
	const { client, error } = useFauna()
	if (error !== null) return error

	try {
		// Default query
		let query = fql`Customer.all().paginate()`

		// Check to see if client is making a paginated request
		if (cursor && count) {
			query = fql`Set.paginate(${cursor}, ${Number(count)})`
		} else if (cursor) {
			query = fql`Set.paginate(${cursor})`
		} else if (podRef) {
			// Check if count parameter is passed for pagination
			if (count) {
				query = fql`let pod = Pod.byId(${podRef})
				Customer.where(.podRef == pod).paginate(${Number(count)})`
			} else {
				query = fql`let pod = Pod.byId(${podRef})
				Customer.where(.podRef == pod).paginate()`
			}
		} else if (count) {
			query = fql`Customer.all().paginate(${Number(count)})`
		} else if (email) {
			query = fql`
			let customer = Customer.firstWhere(.email==${email}); 
			if (!customer.exists()) 
			abort({ message: "Customer with this email does not exist." });
			customer;`
		}

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

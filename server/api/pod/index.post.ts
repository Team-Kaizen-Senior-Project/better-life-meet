import { AbortError, ServiceError, fql } from 'fauna'
import type { Pod } from '~/types'

export default defineEventHandler(async (event) => {
	// Initialize Fauna client
	const { client, error } = useFauna()
	if (error !== null) return error

	try {
		const pod = (await readBody(event)) as Omit<Pod, 'id'>

		const query = fql`
			let pod = {
				name: ${pod.name},
				meetingTime: Time(${String(pod.meetingTime)}),
				leader: Customer.byId(${String(pod.leader)})
			};
			Pod.create(pod);
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

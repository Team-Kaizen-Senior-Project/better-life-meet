import { AbortError, ServiceError, fql } from 'fauna'
import type { Attendee } from '~/types'

export default defineEventHandler(async (event) => {
	// Initialize Fauna client
	const { client, error } = useFauna()

	if (error !== null) return error

	try {
		const attendee = (await readBody(event)) as Attendee

		const query = fql`
            let attendee = {
                joinTime: ${attendee.joinTime},
                leaveTime: ${attendee.leaveTime},
                usedVideo: ${attendee.usedVideo},
                platform: ${attendee.platform},
                customerRef: Customer.byId(${String(attendee.customerRef)}),
                meetingRef: Meeting.byId(${String(attendee.meetingRef)})

            }
            Attendee.create(attendee)
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

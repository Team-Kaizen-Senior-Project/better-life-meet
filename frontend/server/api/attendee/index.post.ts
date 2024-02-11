import { AbortError, ServiceError, fql } from 'fauna'

// Interface for Attendee info
export interface Attendee {
	joinTime: string
	leaveTime: string
	usedVideo: false
	platform: string
	customerRef: string
	meetingRef: string
}

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
                customerRef: Customer.byId(${attendee.customerRef}),
                meetingRef: Meeting.byId(${attendee.meetingRef})

            }
            Attendee.create(attendee)
        `
		const response = await client.query(query)
		return response.data.id
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

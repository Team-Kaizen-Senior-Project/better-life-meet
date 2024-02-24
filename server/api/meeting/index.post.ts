import { AbortError, ServiceError, fql } from 'fauna'
import type { MeetingFields } from '~/types'

// Endpoint for creating a meeting
export default defineEventHandler(async (event) => {
	// Initialize Fauna client
	const { client, error } = useFauna()
	if (error !== null) return error
	// Create new meeting record and assign attendees
	try {
		const meeting = (await readBody(event)) as Required<MeetingFields>

		// Convert the start and end time to date objects
		const startTime = new Date(meeting.startTime)
		const endTime = new Date(meeting.endTime)

		//Get current time
		const currentTime = new Date()

		// Check if meeting start time is in the past
		if (startTime < currentTime) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Cannot schedule a meeting in the past.',
			})
		}

		// Check if meeting end time is greater than start time
		if (endTime < startTime) {
			throw createError({
				statusCode: 400,
				statusMessage: 'The meeting end time must be after the start time.',
			})
		}

		// Perform POST query for meeting
		const query = fql`
		let meeting = {
			startTime: Time(${meeting.startTime}),
			endTime: Time(${meeting.endTime}),
			timeZone: ${meeting.timeZone},
			podRef: Pod.byId(${meeting.podRef}),
		}
		Meeting.create(meeting)
		`

		const response = await client.query(query)

		return response

		// Catch error
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

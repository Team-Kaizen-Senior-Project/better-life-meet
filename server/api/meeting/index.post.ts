import { c } from '@nuxt/test-utils/dist/shared/test-utils.9059LSjm'
import { AbortError, ServiceError, fql } from 'fauna'
import type { MeetingFields, RoomResponse, RoomCodeResponse } from '~/types'

// Endpoint for creating a meeting
export default defineEventHandler(async (event) => {
	// Initialize Fauna client
	const { client, error } = useFauna()
	if (error !== null) return error
	// Create new meeting record and assign attendees
	try {
		const meeting = (await readBody(event)) as Required<MeetingFields>

		// Generate a management token
		const managementToken = await generateManagementToken()

		// Convert the start and end time to date objects
		const startTime = new Date(meeting.startTime)
		const endTime = new Date(meeting.endTime)

		//Get current time
		const currentTime = new Date()

		// Check if meeting start time is in the past
		if (startTime < currentTime)
			throw createError({ statusCode: 400, statusMessage: 'Cannot schedule a meeting in the past.' })
		if (endTime < startTime)
			throw createError({ statusCode: 400, statusMessage: 'The meeting end time must be after the start time.' })

		// Create room in 100ms
		const roomResponse = await fetch('https://api.100ms.live/v2/rooms', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${managementToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name: `Meeting ${meeting.startTime} Pod ${meeting.podRef} Created ${currentTime.toISOString()}`,
				description: 'Pod meeting room',
			}),
		})

		if (!roomResponse.ok) {
			throw new Error('Error creating room')
		}

		const roomData: RoomResponse = await roomResponse.json()
		const roomId = roomData.id

		// Create room code for the room
		const roomCodeResponse = await fetch(`https://api.100ms.live/v2/room-codes/room/${roomId}`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${managementToken}`,
				'Content-Type': 'application/json',
			},
		})

		if (!roomCodeResponse.ok) {
			throw new Error('Error creating room code')
		}

		const roomCodeData: RoomCodeResponse = await roomCodeResponse.json()
		const roomCode = roomCodeData.data[0].code // first role's code

		const query = fql`
        let meeting = {
            startTime: Time(${meeting.startTime}),
            endTime: Time(${meeting.endTime}),
            timeZone: ${meeting.timeZone},
            podRef: Pod.byId(${meeting.podRef}),
            vimeoId: ${meeting.vimeoId},
			roomId: ${roomId},
            roomCode: ${roomCode}
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

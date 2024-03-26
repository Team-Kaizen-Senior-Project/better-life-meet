import { AbortError, ServiceError, fql } from 'fauna'
import type { MeetingFields } from '~/types'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

// Function to generate a management token
function generateManagementToken() {
	const payload = {
		access_key: process.env.APP_ACCESS_KEY,
		type: 'management',
		version: 2,
		iat: Math.floor(Date.now() / 1000),
		nbf: Math.floor(Date.now() / 1000),
	}

	return new Promise((resolve, reject) => {
		jwt.sign(
			payload,
			process.env.APP_SECRET!,
			{ algorithm: 'HS256', expiresIn: '24h', jwtid: uuidv4() },
			(err, token) => (err ? reject(err) : resolve(token)),
		)
	})
}

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
				name: `Meeting ${meeting.startTime}`,
				description: 'Meeting room',
			}),
		})

		const roomData = await roomResponse.json()
		const roomId = roomData.id

		// Create room code for the room
		const roomCodeResponse = await fetch(`https://api.100ms.live/v2/room-codes/room/${roomId}`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${managementToken}`,
				'Content-Type': 'application/json',
			},
		})

		const roomCodeData = await roomCodeResponse.json()
		const roomCode = roomCodeData.data[0].code // first role's code

		const query = fql`
        let meeting = {
            startTime: Time(${meeting.startTime}),
            endTime: Time(${meeting.endTime}),
            timeZone: ${meeting.timeZone},
            podRef: Pod.byId(${meeting.podRef}),
            vimeoId: ${meeting.vimeoId},
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

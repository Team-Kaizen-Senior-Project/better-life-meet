import { Server as SocketServer } from 'socket.io'
import type { Attendee, AttendeeFields, Numberic } from '~/types'

const socketEventHandler = async (wss: SocketServer) => {
	console.log('✔ Socket.io server is listening')

	const socketAttendeeMap = new Map()

	wss.on('connection', (ws) => {
		console.log(`Socket [${ws.id}] has connected.`)

		ws.on('joinMeeting', async ({ customerRef, meetingId, isCameraOn }) => {
			console.log(`Joining meeting [${meetingId}] as customer [${customerRef}].`)
			const startTime = new Date().toISOString()

			const fields: AttendeeFields = {
				joinTime: startTime,
				leaveTime: startTime,
				customerRef,
				usedVideo: isCameraOn,
				meetingRef: meetingId,
				// TODO: use actual user device
				platform: 'Mobile',
			}

			try {
				const newAttendee = await createAttendee(fields)
				socketAttendeeMap.set(ws.id, newAttendee.id)
			} catch (error) {
				console.log('error creating attendee', error)
			}
		})
		ws.on('disconnect', async () => {
			console.log(`Socket [${ws.id}] has disconnected.`)

			const attendeeId = socketAttendeeMap.get(ws.id)
			// if ws.id is in the map
			if (attendeeId) {
				try {
					await updateAttendee(attendeeId, {
						leaveTime: new Date().toISOString(),
					})
				} catch (error) {
					console.log('error updating attendee leaveTime', error)
				}
				socketAttendeeMap.delete(ws.id)
			}
		})
		ws.on('toggleVideo', async () => {
			const attendeeId = socketAttendeeMap.get(ws.id)
			if (attendeeId) {
				try {
					await updateAttendee(attendeeId, {
						usedVideo: true,
					})
				} catch (error) {
					console.log('error updating attendee usedVideo', error)
				}
			}
		})
	})
}

const createAttendee = async (attendee: AttendeeFields): Promise<Attendee> => {
	const response = await $fetch<{ data: Attendee }>('/api/attendee', {
		method: 'POST',
		body: attendee,
	})

	const newAttendee = response.data
	return newAttendee
}

const updateAttendee = async (id: any, attendee: AttendeeFields): Promise<Attendee> => {
	const response = await $fetch<{ data: Attendee }>(`/api/attendee/${id}`, {
		method: 'PATCH',
		body: attendee,
	})

	const updatedAttendee = response.data
	return updatedAttendee
}

export default socketEventHandler

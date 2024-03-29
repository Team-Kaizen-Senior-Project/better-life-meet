import type {
	Attendee,
	AttendeeFields,
	Customer,
	CustomerFields,
	HmsEventsResponse,
	HmsPeers,
	HmsRoom,
	HmsSession,
	Meeting,
	MeetingFields,
	Numberic,
	Pod,
	PodFields,
} from '~/types'

// All the api requests, error and response handling should happen where they are being called.

type MeetingQueryParams =
	| { podId?: never; count?: number; cursor?: string }
	| { podId: Numberic; count?: number; cursor?: never }

type EventsFilters = {
	session_id?: string
	peer_id?: string
	user_id?: string
	limit?: number
	start?: string
}

export const useApi = () => {
	const createCustomer = async (customer: CustomerFields) => {
		const response = await $fetch<{ data: Customer }>('/api/customer', {
			method: 'POST',
			body: customer,
		})

		const newCustomer = response.data
		return newCustomer
	}

	const getCustomer = async (id: Numberic): Promise<Customer> => {
		const response = await $fetch<{ data: Customer }>(`/api/customer/${id}`)

		const customer = response.data
		return customer
	}

	const getCustomerByEmail = async (email: string): Promise<Customer> => {
		const response = await $fetch<{ data: Customer }>(`/api/customer?email=${email}`)

		const customer = response.data
		return customer
	}

	const updateCustomer = async (id: Numberic, customer: CustomerFields): Promise<Customer> => {
		const response = await $fetch<{ data: Customer }>(`/api/customer/${id}`, {
			method: 'PATCH',
			body: customer,
		})

		const updatedCustomer = response.data
		return updatedCustomer
	}

	const deleteCustomer = async (id: Numberic): Promise<unknown> => {
		const response = await $fetch(`/api/customer/${id}`, { method: 'DELETE' })

		return response
	}

	const createPod = async (pod: PodFields): Promise<Pod> => {
		const response = await $fetch<{ data: Pod }>('/api/pod', {
			method: 'POST',
			body: pod,
		})

		const newPod = response.data
		return newPod
	}

	const getPod = async (id: Numberic): Promise<Pod> => {
		const response = await $fetch<{ data: Pod }>(`/api/pod/${id}`)

		const pod = response.data
		return pod
	}

	const updatePod = async (id: Numberic, pod: PodFields): Promise<Pod> => {
		const response = await $fetch<{ data: Pod }>(`/api/pod/${id}`, {
			method: 'PATCH',
			body: pod,
		})

		const updatedPod = response.data
		return updatedPod
	}

	const deletePod = async (id: Numberic): Promise<unknown> => {
		const response = await $fetch(`/api/pod/${id}`, { method: 'DELETE' })

		return response
	}

	const createMeeting = async (meeting: MeetingFields): Promise<Meeting> => {
		console.log(meeting)
		const response = await $fetch<{ data: Meeting }>('/api/meeting', {
			method: 'POST',
			body: meeting,
		})

		const newMeeting = response.data
		return newMeeting
	}

	const getMeeting = async (id: Numberic): Promise<Meeting> => {
		const response = await $fetch<{ data: Meeting }>(`/api/meeting/${id}`)

		const meeting = response.data
		return meeting
	}

	const getMeetings = async (params?: MeetingQueryParams): Promise<Meeting[]> => {
		const response = await $fetch<{ data: { data: Meeting[] } }>(`/api/meeting`, { params })
		//console.log(response.data.data)
		// filter out meetings that have already ended
		// sort the meetings by start time so newest is first
		return response.data.data
			.filter((meeting) => typeof meeting.endTime != 'string' && new Date(meeting.endTime.isoString) > new Date())
			.sort((a, b) => a.startTime.isoString.localeCompare(b.startTime.isoString))
	}

	const updateMeeting = async (id: Numberic, meeting: MeetingFields): Promise<Meeting> => {
		const response = await $fetch<{ data: Meeting }>(`/api/meeting/${id}`, {
			method: 'PATCH',
			body: meeting,
		})

		const updatedMeeting = response.data
		return updatedMeeting
	}

	const deleteMeeting = async (id: Numberic): Promise<unknown> => {
		const response = await $fetch(`/api/meeting/${id}`, { method: 'DELETE' })

		return response
	}

	const createAttendee = async (attendee: AttendeeFields): Promise<Attendee> => {
		const response = await $fetch<{ data: Attendee }>('/api/attendee', {
			method: 'POST',
			body: attendee,
		})

		const newAttendee = response.data
		return newAttendee
	}

	const getAttendee = async (id: Numberic): Promise<Attendee> => {
		const response = await $fetch<{ data: Attendee }>(`/api/attendee/${id}`)

		const attendee = response.data
		return attendee
	}

	const updateAttendee = async (id: Numberic, attendee: AttendeeFields): Promise<Attendee> => {
		const response = await $fetch<{ data: Attendee }>(`/api/attendee/${id}`, {
			method: 'PATCH',
			body: attendee,
		})

		const updatedAttendee = response.data
		return updatedAttendee
	}

	const deleteAttendee = async (id: Numberic): Promise<unknown> => {
		const response = await $fetch(`/api/attendee/${id}`, { method: 'DELETE' })

		return response
	}

	const getHmsRoom = async (roomId: string): Promise<HmsRoom> => {
		const managementToken = await generateManagementToken()

		const room = await $fetch<HmsRoom>(`https://api.100ms.live/v2/active-rooms/${roomId}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${managementToken}`,
				'Content-Type': 'application/json',
			},
		})

		return room
	}

	const getHmsSession = async (sessionId: string): Promise<HmsSession> => {
		const managementToken = await generateManagementToken()

		const session = await $fetch<HmsSession>(`https://api.100ms.live/v2/sessions/${sessionId}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${managementToken}`,
				'Content-Type': 'application/json',
			},
		})

		return session
	}

	const getHmsEvents = async (
		roomId: string,
		eventType: 'add' | 'update' | 'remove',
		filters?: EventsFilters,
	): Promise<HmsEventsResponse> => {
		const managementToken = await generateManagementToken()

		const queryParams = {
			room_id: roomId,
			type: `track.${eventType}.success`,
			...filters,
		}

		const events = await $fetch<HmsEventsResponse>(`https://api.100ms.live/v2/analytics/events`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${managementToken}`,
				'Content-Type': 'application/json',
			},
			query: queryParams,
		})

		return events
	}

	const getHmsPeers = async (roomId: string, filters?: { user_id?: string; role?: string }): Promise<HmsPeers> => {
		const managementToken = await generateManagementToken()

		const queryParams = { ...filters }

		const peers = await $fetch<HmsPeers>(`https://api.100ms.live/v2/active-rooms/${roomId}/peers`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${managementToken}`,
				'Content-Type': 'application/json',
			},
			query: queryParams,
		})

		return peers
	}

	return {
		// Customer
		createCustomer,
		getCustomer,
		getCustomerByEmail,
		updateCustomer,
		deleteCustomer,

		// Pod
		createPod,
		getPod,
		updatePod,
		deletePod,

		// MEETINGS
		getMeetings,
		deleteMeeting,
		createMeeting,
		getMeeting,
		updateMeeting,

		// Attendee
		createAttendee,
		getAttendee,
		updateAttendee,
		deleteAttendee,

		// HMS
		getHmsRoom,
		getHmsSession,
		getHmsEvents,
		getHmsPeers,
	}
}

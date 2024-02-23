import type { Attendee, Customer, Meeting, Numberic, Pod } from '~/types'

// All the api requests, error and response handling should happen where they are being called.

type MeetingQueryParams =
	| { cursor?: string; count?: number; podId?: undefined }
	| { podId: Numberic; count?: number; cursor?: undefined }

export const useApi = () => {
	const createCustomer = async (customer: Omit<Customer, 'id'>) => {
		const response = await $fetch('/api/customer', {
			method: 'POST',
			body: customer,
		})

		const newCustomer = response.data as unknown as Customer
		return newCustomer
	}

	const getCustomer = async (id: Numberic): Promise<Customer> => {
		const response = await $fetch(`/api/customer/${id}`)

		const customer = response.data as unknown as Customer
		return customer
	}

	const getCustomerByEmail = async (email: string): Promise<Customer> => {
		const response = await $fetch(`/api/customer?email=${email}`)

		const customer = response.data as unknown as Customer
		return customer
	}

	const updateCustomer = async (id: Numberic, customer: Partial<Omit<Customer, 'id'>>): Promise<Customer> => {
		const response = await $fetch(`/api/customer/${id}`, {
			method: 'PATCH',
			body: customer,
		})

		const updatedCustomer = response.data as unknown as Customer
		return updatedCustomer
	}

	const deleteCustomer = async (id: Numberic): Promise<unknown> => {
		const response = await $fetch(`/api/customer/${id}`, { method: 'DELETE' })

		return response
	}

	const createPod = async (pod: Omit<Pod, 'id'>) => {
		const response = await $fetch('/api/pod', {
			method: 'POST',
			body: pod,
		})

		const newPod = response.data as unknown as Pod
		return newPod
	}

	const getPod = async (id: Numberic): Promise<Pod> => {
		const response = await $fetch(`/api/pod/${id}`)

		const pod = response.data as unknown as Pod
		return pod
	}

	const updatePod = async (id: Numberic, pod: Partial<Omit<Pod, 'id'>>): Promise<Pod> => {
		const response = await $fetch(`/api/pod/${id}`, {
			method: 'PATCH',
			body: pod,
		})

		const updatedPod = response.data as unknown as Pod
		return updatedPod
	}

	const deletePod = async (id: Numberic): Promise<unknown> => {
		const response = await $fetch(`/api/pod/${id}`, { method: 'DELETE' })

		return response
	}

	const createMeeting = async (meeting: Omit<Meeting, 'id'>): Promise<Meeting> => {
		const response = await $fetch('/api/meeting', {
			method: 'POST',
			body: meeting,
		})

		const newMeeting = response.data as unknown as Meeting
		return newMeeting
	}

	const getMeeting = async (id: Numberic): Promise<Meeting> => {
		const response = await $fetch(`/api/meeting/${id}`)

		const meeting = response.data as unknown as Meeting
		return meeting
	}

	const getMeetings = async (meetingQueryParams?: MeetingQueryParams): Promise<Meeting[]> => {
		const response = await $fetch(`/api/meeting`, { query: meetingQueryParams })

		const meetings = response.data as unknown as Meeting[]
		return meetings
	}

	const updateMeeting = async (id: Numberic, meeting: Partial<Omit<Meeting, 'id'>>): Promise<Meeting> => {
		const response = await $fetch(`/api/meeting/${id}`, {
			method: 'PATCH',
			body: meeting,
		})

		const updatedMeeting = response.data as unknown as Meeting
		return updatedMeeting
	}

	const deleteMeeting = async (id: Numberic): Promise<unknown> => {
		const response = await $fetch(`/api/meeting/${id}`, { method: 'DELETE' })

		return response
	}

	const createAttendee = async (attendee: Omit<Attendee, 'id'>): Promise<Attendee> => {
		const response = await $fetch('/api/attendee', {
			method: 'POST',
			body: attendee,
		})

		const newAttendee = response.data as unknown as Attendee
		return newAttendee
	}

	const getAttendee = async (id: Numberic): Promise<Attendee> => {
		const response = await $fetch(`/api/attendee/${id}`)

		const attendee = response.data as unknown as Attendee
		return attendee
	}

	const updateAttendee = async (id: Numberic, attendee: Partial<Omit<Attendee, 'id'>>): Promise<Attendee> => {
		const response = await $fetch(`/api/attendee/${id}`, {
			method: 'PATCH',
			body: attendee,
		})

		const updatedAttendee = response.data as unknown as Attendee
		return updatedAttendee
	}

	const deleteAttendee = async (id: Numberic): Promise<unknown> => {
		const response = await $fetch(`/api/attendee/${id}`, { method: 'DELETE' })

		return response
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

		// Meeting
		createMeeting,
		getMeetings,
		getMeeting,
		updateMeeting,
		deleteMeeting,

		// Attendee
		createAttendee,
		getAttendee,
		updateAttendee,
		deleteAttendee,
	}
}

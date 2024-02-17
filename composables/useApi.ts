import type { Attendee, Customer, Meeting, Numberic, Pod } from '~/types'

// All the api requests, error and response handling should happen where they are being called.

export const useApi = () => {
	const me = () => $fetch<{ user: Customer }>('/api/auth/customer')

	const getPod = async (id: Numberic): Promise<Pod> => {
		const response = await $fetch(`/api/pod/${id}`)

		const pod = response.data as Pod
		return pod
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

	const getAttendee = async (id: Numberic, idType: string = 'customer') => {
		const response = await $fetch(`/api/attendee/${id}`, {
			params: { idType },
		})
		return response
	}

	const getMeetings = async (params?: any) => {
		const response = await $fetch<{ data: { data: Meeting[] } }>(`/api/meeting`, { params })
		return response.data.data
	}

	const deleteMeeting = async (id: Numberic) => {
		await $fetch(`/api/meeting/${id}`, { method: 'DELETE' })
	}

	const createMeeting = async (meeting: Omit<Meeting, 'id'>) => {
		const response = await $fetch('/api/meeting', {
			method: 'POST',
			body: meeting,
		})
		return response
	}

	const createAttendee = async (attendee: Omit<Attendee, 'id'>) => {
		const response = await $fetch<string>('/api/attendee', {
			method: 'POST',
			body: attendee,
		})
		return response
	}

	const updateAttendee = async (id: Numberic, attendee: Partial<Attendee>) => {
		const response = await $fetch(`/api/attendee/${id}`, {
			method: 'PATCH',
			body: attendee,
		})
		return response
	}

	return {
		// CUSTOMER/ME
		me,
		getCustomer,

		// POD
		getPod,

		// MEETINGS
		getMettings: getMeetings,
		deleteMeeting,
		createMeeting,

		getAttendee,
		createAttendee,
		updateAttendee,
	}
}

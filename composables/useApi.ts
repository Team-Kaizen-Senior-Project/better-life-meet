import type { AttendeeFields, Customer, Meeting, MeetingFields, Numberic } from '~/types'

// All the api requests, error and response handling should happen where they are being called.

export const useApi = () => {
	const me = () => $fetch<{ user: Customer }>('/api/auth/customer')

	const getPod = async (id: Numberic) => {
		const response = await $fetch<any>(`/api/pod/${id}`)
		return response
	}

	const getCustomer = async (id: Numberic) => {
		const response = await $fetch<any>(`/api/customer/${id}`)
		return response
	}

	const getAttendee = async (id: Numberic, idType: string = 'customer') => {
		const response = await $fetch(`/api/attendee/${id}`, {
			params: { idType },
		})
		return response
	}

	const getMeetings = async (params?: any) => {
		const response = await $fetch<{ data: { data: Meeting[] } }>(`/api/meeting`, { params })
		console.log(response.data.data)
		// filter out meetings that have already ended
		// sort the meetings by start time so newest is first
		return response.data.data
			.filter((meeting: any) => new Date(meeting.endTime) > new Date())
			.sort((a: any, b: any) => a.startTime.localeCompare(b.startTime))
	}

	const deleteMeeting = async (id: Numberic) => {
		await $fetch(`/api/meeting/${id}`, { method: 'DELETE' })
	}

	const createMeeting = async (fields: MeetingFields) => {
		const response = await $fetch('/api/meeting', {
			method: 'POST',
			body: fields,
		})
		return response
	}

	const createAttendee = async (fields: AttendeeFields) => {
		const response = await $fetch<string>('/api/attendee', {
			method: 'POST',
			body: fields,
		})
		return response
	}

	const updateAttendee = async (id: Numberic, fields: AttendeeFields) => {
		const response = await $fetch(`/api/attendee/${id}`, {
			method: 'PATCH',
			body: fields,
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
		getMeetings,
		deleteMeeting,
		createMeeting,

		getAttendee,
		createAttendee,
		updateAttendee,
	}
}

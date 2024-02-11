import { start } from "repl"

// Interface for Attendee info
export interface Attendee {
	joinTime: String
	leaveTime: String
	usedVideo: Boolean
	platform: String
	customerRef: String
	meetingRef: String
}
export const useAttendeeStore = defineStore('attendee', () => {
    const attendeeId = ref(null);

    async function createAttendee(customerRef: String, meetingRef: String, startTime: Date, platform: String, isCameraOn: Boolean){
		try{
			const attendeeInfo : Attendee = {
				joinTime:  startTime.toISOString(),
				leaveTime: null,
				usedVideo: isCameraOn,
				platform: platform,
				customerRef: customerRef,
				meetingRef: meetingRef,
			}
			const response = await fetch(`/api/attendee`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(attendeeInfo),
			})
			if (!response.ok) {
				throw new Error('Error creating attendee')
			}
			const id = await response.json();
			attendeeId.value = id
			console.log(attendeeId.value)
		} catch (error) {
			console.error('Error:', error)
			throw error
		}
	}
	async function logCameraUsed(attendeeId: String){
		const url = `/api/attendee/${attendeeId}`; 
		const body = {
			usedVideo: true
		};
		// Update attendee 'usedVideo' field in the db
		try {
			const response = await fetch(url, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const data = await response.json();
			console.log('Successfully updated:', data);
			return data; 
		} catch (error) {
			console.error('Error updating usedVideo:', error);
		}
	}
	async function logLeaveTime(attendeeId: String){
		const url = `/api/attendee/${attendeeId}`; 
		const body = {
			leaveTime: new Date()
		};
		// Update attendee 'usedVideo' field in the db
		try {
			const response = await fetch(url, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const data = await response.json();
			console.log('Successfully updated:', data);
			return data; 
		} catch (error) {
			console.error('Error updating leave time:', error);
		}
	}

    return { attendeeId, createAttendee, logCameraUsed, logLeaveTime }
});
// Created an attendee when joining a meeting



// Fetches an attendee from the API using the ID and ID type (customer or attendee id)
export async function fetchAttendee(id: string, idType = 'customer') {
	// Construct the URL with query parameters
	const url = `/api/attendee/${id}?idType=${idType}`

	// Use the useFetch function from Nuxt 3
	const { data, error } = await useFetch(url)

	if (error.value) {
		console.error('Error fetching attendee:', error.value)
		return null
	}

	return data.value?.data // Extract the `data` field from the response
}

// Fetches all attendees from the API
export async function fetchAllAttendees() {
	const url = `/api/attendee` // URL for the API endpoint to fetch all attendees
	const { data, error } = await useFetch(url)

	if (error.value) {
		console.error('Error fetching all attendees:', error.value)
		return null
	}

	return data.value?.data // Return the array of attendees
}

// Deletes an attendee using the API
export async function deleteAttendee(id: string) {
	try {
		const response = await fetch(`/api/attendee/${id}`, {
			method: 'DELETE',
		})

		if (!response.ok) {
			throw new Error('Error deleting attendee')
		}

		return await response
	} catch (error) {
		console.error('Error:', error)
		throw error
	}
}

// Updates an attendee using the API
export async function updateAttendee(id: string, updateInfo: any) {
	try {
		const response = await fetch(`/api/attendee/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updateInfo),
		})

		if (!response.ok) {
			throw new Error('Error updating attendee')
		}

		return await response.json()
	} catch (error) {
		console.error('Error:', error)
		throw error
	}
}

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

// Creates an attendee using the API
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

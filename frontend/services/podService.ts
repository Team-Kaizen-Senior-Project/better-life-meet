// Fetches a pod from the API using the provided ID
export async function fetchPod(id: string) {
	// Construct the URL with query parameters
	const url = `/api/pod/${id}`

	// Use the useFetch function from Nuxt 3
	const { data, error } = await useFetch(url)

	if (error.value) {
		console.error('Error fetching pod:', error.value)
		return null
	}

	return data.value?.data // Extract the `data` field from the response
}

// Fetches all pods from the API
export async function fetchAllPods() {
	const url = `/api/pod` // URL for the API endpoint to fetch all attendees
	const { data, error } = await useFetch(url)

	if (error.value) {
		console.error('Error fetching all pods:', error.value)
		return null
	}

	return data.value?.data // Return the array of attendees
}

// Deletes a pod using the API
export async function deletePod(id: string) {
	try {
		const response = await fetch(`/api/pod/${id}`, {
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

// Updates a pod using the API
export async function updatePod(id: string, updateInfo: any) {
	try {
		const response = await fetch(`/api/pod/${id}`, {
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

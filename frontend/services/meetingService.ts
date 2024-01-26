// Fetches a meeting from the API given a meeting ID
export async function fetchMeeting(id: string) {
	// Construct the URL with query parameters
	const url = `/api/meeting/${id}`

	// Use the useFetch function from Nuxt 3
	const { data, error } = await useFetch(url)

	if (error.value) {
		console.error('Error fetching meeting:', error.value)
		return null
	}

	return data.value?.data // Extract the `data` field from the response
}

// Fetches all meetings from the API
export async function fetchAllMeetings() {
	const url = `/api/meeting` // URL for the API endpoint to fetch all meetings
	const { data, error } = await useFetch(url)

	if (error.value) {
		console.error('Error fetching all meetings:', error.value)
		return null
	}

	return data.value?.data // Return the array of meetings
}

// Deletes a meeting using the API
export async function deleteMeeting(id: string) {
	try {
		const response = await fetch(`/api/meeting/${id}`, {
			method: 'DELETE',
		})

		if (!response.ok) {
			throw new Error('Error deleting meeting')
		}

		return await response
	} catch (error) {
		console.error('Error:', error)
		throw error
	}
}

// Creates a meeting using the API
export async function createMeeting(meetingInfo: any) {
    try {
        const response = await fetch(`/api/meeting`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(meetingInfo),
        })

        if (!response.ok) {
            throw new Error('Error creating meeting')
        }

        return await response
    } catch (error) {
        console.error('Error:', error)
        throw error
    }
}

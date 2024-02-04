// InterFace for updating pods
export interface Pod {
	name?: string
	meetingTime?: string
	leader?: string
	memberId?: string // allows single user updates for pod
	meetingId?: string // allows single meeting updates for pod
}

// Fetches a pod from the API using the provided ID
export async function fetchPod(id: string) {
	// Construct the URL with query parameters
	const url = `/api/pod/${id}`
	const { data, error } = await useFetch(url)

	if (error.value) {
		console.error('Error fetching pod:', error.value)
		return null
	}

	return data.value?.data
}

// Fetches all pods from the API
export async function fetchAllPods() {
	const url = `/api/pod`
	const { data, error } = await useFetch(url)

	if (error.value) {
		console.error('Error fetching all pods:', error.value)
		return null
	}

	return data.value?.data
}

// Deletes a pod using the API
export async function deletePod(id: string) {
	try {
		const response = await fetch(`/api/pod/${id}`, {
			method: 'DELETE',
		})

		if (!response.ok) {
			throw new Error('Error deleting Pod')
		}

		return await response.json()
	} catch (error) {
		console.error('Error:', error)
		throw error
	}
}

// Updates a pod using the API (allows updates to )
export async function updatePod(id: string, updateInfo: Pod) {
	try {
		const response = await fetch(`/api/pod/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updateInfo),
		})

		if (!response.ok) {
			throw new Error('Error updating Pod')
		}

		return await response.json()
	} catch (error) {
		console.error('Error:', error)
		throw error
	}
}

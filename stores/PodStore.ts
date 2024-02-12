import { useApi } from '~/composables/useApi'
import type { Numberic, Time } from '~/types'

export interface Pod {
	name?: string
	meetingTime?: Time
	leader: { id: string }
	meetingId?: string // allows single meeting updates for pod
	id: string
}

interface State {
	pod?: Pod
}

export const usePodStore = defineStore('pod', () => {
	const { state: customerState } = useCustomerStore()
	const { getPod: getPodApi } = useApi()

	const state = reactive<State>({
		pod: undefined,
	})

	const getPod = async (id: Numberic) => {
		try {
			const res = await getPodApi(id)
			state.pod = res.data
		} catch (error) {
			console.error('Error fetching pod:', error)
		}
	}

	// For checking if is leader of a pod
	const getIsLeader = (id?: Pod['id']) => {
		if (!id || !customerState.customer?.id) return false
		return id == customerState.customer.id
	}

	const isLeader = computed(() => {
		return getIsLeader(state.pod?.leader.id)
	})

	return {
		getPod,
		getIsLeader,
		state,
		isLeader,
	}
})

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

		return response.json()
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

		return response.json()
	} catch (error) {
		console.error('Error:', error)
		throw error
	}
}

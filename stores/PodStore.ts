import { useApi } from '~/composables/useApi'
import type { Numberic, Pod, Time } from '~/types'

interface State {
	pod?: Pod
}

export const usePodStore = defineStore('pod', () => {
	// TODO: This is unused
	const state = reactive<State>({
		pod: undefined,
	})
	const getMyPod = async (): Promise<Pod | null> => {
		const { getPod } = useApi()
		const { state: customerState } = useCustomerStore()

		// Check if customer exists
		if (!customerState.customer) {
			console.error('Customer does not exist')
			return null
		}

		const customer = customerState.customer

		// Proceed with existing checks for podRef and podRef.id
		if (!customer.podRef || !customer.podRef.id) {
			console.error('Customer podRef or podRef.id is undefined')
			return null
		}

		const pod: Pod = await getPod(customer.podRef.id)
		state.pod = pod

		console.log(state.pod)

		return pod
	}

	const isLeader = computed(() => {
		const { state: customerState } = useCustomerStore()
		const customer = customerState.customer
		const pod = state.pod

		return customer?.id === pod?.leader.id
	})

	return {
		getMyPod,
		state,
		isLeader,
	}
})

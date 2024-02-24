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

	const getMyPod = async (): Promise<Pod> => {
		const { getPod } = useApi()
		const { state: customerState } = useCustomerStore()
		const customer = customerState.customer!
		const pod: Pod = await getPod(customer.podRef!.id!)

		state.pod = pod

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

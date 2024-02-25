import type { Customer, Pod } from '~/types'
interface State {
	customer?: Customer
}
export const useCustomerStore = defineStore('customer', () => {
	// TODO: This is unused
	const state = reactive<State>({
		customer: undefined,
	})

	const getMe = async (): Promise<Customer> => {
		const { getSession } = useAuth()
		const session = await getSession()
		const customer = session.user as Customer

		state.customer = customer

		return customer
	}

	return {
		getMe,
		state,
	}
})

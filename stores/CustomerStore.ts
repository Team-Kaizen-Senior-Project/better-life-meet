import { useApi } from '~/composables/useApi'
import type { Customer } from '~/types'
interface State {
	customer?: Customer
}
export const useCustomerStore = defineStore('customer', () => {
	const state = reactive<State>({
		customer: undefined,
	})

	const myGoodRef = ref('wr234')

	const { me } = useApi()
	const getMe = async () => {
		try {
			const res = await me()
			state.customer = res.user
			return res.user
		} catch (error) {
			console.error('Error fetching customer:', error)
		}
	}
	return {
		getMe,
		state,
		myGoodRef,
	}
})

// // Fetches a customer from the API given a customer ID
// export async function fetchCustomer(id: string) {
// 	const url = `/api/customer/${id}`
// 	const { data, error } = await useFetch(url)

// 	if (error.value) {
// 		console.error('Error fetching customer:', error.value)
// 		return null
// 	}

// 	return data.value?.data
// }

// // Fetches all customers from the API
// export async function fetchAllCustomers() {
// 	const url = `/api/customer`
// 	const { data, error } = await useFetch(url)

// 	if (error.value) {
// 		console.error('Error fetching all customers:', error.value)
// 		return null
// 	}

// 	return data.value?.data
// }

// // Deletes a customer using the API
// export async function deleteCustomer(id: string) {
// 	try {
// 		const response = await fetch(`/api/customer/${id}`, {
// 			method: 'DELETE',
// 		})

// 		if (!response.ok) {
// 			throw new Error('Error deleting customer')
// 		}

// 		return await response
// 	} catch (error) {
// 		console.error('Error:', error)
// 		throw error
// 	}
// }

// // Creates a customer using the API
// export async function createCustomer(customerInfo: any) {
// 	try {
// 		const response = await fetch(`/api/customer`, {
// 			method: 'POST',
// 			headers: {
// 				'Content-Type': 'application/json',
// 			},
// 			body: JSON.stringify(customerInfo),
// 		})

// 		if (!response.ok) {
// 			throw new Error('Error creating customer')
// 		}

// 		return await response
// 	} catch (error) {
// 		console.error('Error:', error)
// 		throw error
// 	}
// }

// // Updates a customer using the API
// export async function updateCustomer(id: string, customerInfo: any) {
// 	try {
// 		const response = await fetch(`/api/customer/${id}`, {
// 			method: 'PUT',
// 			headers: {
// 				'Content-Type': 'application/json',
// 			},
// 			body: JSON.stringify(customerInfo),
// 		})

// 		if (!response.ok) {
// 			throw new Error('Error updating customer')
// 		}

// 		return await response
// 	} catch (error) {
// 		console.error('Error:', error)
// 		throw error
// 	}
// }

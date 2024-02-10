// Fetches a customer from the API given a customer ID
export async function fetchCustomer(id: string) {
	const url = `/api/customer/${id}`
	const { data, error } = await useFetch(url)

	if (error.value) {
		console.error('Error fetching customer:', error.value)
		return null
	}

	return data.value?.data
}

export async function fetchCustomerSession() {
	const url = '/api/auth/customer'
	const response = await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	})
	return await response.json()
}

// Fetches all customers from the API
export async function fetchAllCustomers() {
	const url = `/api/customer`
	const { data, error } = await useFetch(url)

	if (error.value) {
		console.error('Error fetching all customers:', error.value)
		return null
	}

	return data.value?.data
}

// Deletes a customer using the API
export async function deleteCustomer(id: string) {
	try {
		const response = await fetch(`/api/customer/${id}`, {
			method: 'DELETE',
		})

		if (!response.ok) {
			throw new Error('Error deleting customer')
		}

		return await response
	} catch (error) {
		console.error('Error:', error)
		throw error
	}
}

// Creates a customer using the API
export async function createCustomer(customerInfo: any) {
	try {
		const response = await fetch(`/api/customer`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(customerInfo),
		})

		if (!response.ok) {
			throw new Error('Error creating customer')
		}

		return await response
	} catch (error) {
		console.error('Error:', error)
		throw error
	}
}

// Updates a customer using the API
export async function updateCustomer(id: string, customerInfo: any) {
	try {
		const response = await fetch(`/api/customer/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(customerInfo),
		})

		if (!response.ok) {
			throw new Error('Error updating customer')
		}

		return await response
	} catch (error) {
		console.error('Error:', error)
		throw error
	}
}

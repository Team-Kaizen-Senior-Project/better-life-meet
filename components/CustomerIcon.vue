<script setup lang="ts">
	const { state: customerState } = useCustomerStore()
	const customer = computed(() => customerState.customer)

	const hashCode = (str: string) => {
		// djb2 hash function - picked for separation of hashes
		let hash = 5381
		for (let i = 0; i < str.length; i++) {
			hash = (hash * 33) ^ str.charCodeAt(i)
		}
		return hash >>> 0
	}

	const generateColor = (firstName: string | undefined, lastName: string | undefined) => {
		// hsl class for unique customer icon color
		let color: string
		if (typeof firstName === 'string' && typeof lastName === 'string') {
			const hash = hashCode(firstName + lastName)
			const hue = hash % 360
			const sat = hash % 100
			color = `hsl(${hue}, ${sat}%, 60%, 0.90)`
		} else {
			color = `hsl(35, 3%, 84%, 0.80)` // default
		}
		return color
	}

	const getInitials = (firstName: string | undefined, lastName: string | undefined) => {
		if (typeof firstName === 'string' && typeof lastName === 'string') {
			return (firstName[0] || '') + (lastName[0] || '')
		} else {
			return ''
		}
	}
</script>

<template>
	<button
		class="inline-block aspect-[1/1] h-10 w-10 rounded-full text-white"
		:style="{ backgroundColor: generateColor(customer?.firstName, customer?.lastName) }"
	>
		{{ getInitials(customer?.firstName, customer?.lastName) }}
	</button>
</template>

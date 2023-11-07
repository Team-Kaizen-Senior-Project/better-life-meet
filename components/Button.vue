<script setup>
	import { computed } from 'vue'

	const props = defineProps({
		type: {
			type: String,
			default: 'primary', // Set a default button type if none is provided
		},
		disabled: Boolean,
	})

	const buttonClasses = computed(() => {
		const baseClasses =
			'inline-flex items-center rounded px-2.5 py-1.5 text-xs font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2'
		const typeClasses = {
			primary: 'bg-neutral-600 text-white hover:bg-neutral-700 focus:ring-neutral-500',
			secondary: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500',
			// ... add more button types here
		}

		const disabledClasses = 'opacity-50 cursor-not-allowed'
		return `${baseClasses} ${typeClasses[props.type] || ''} ${props.disabled ? disabledClasses : ''}`
	})
</script>

<template>
	<button type="button" :class="buttonClasses" :disabled="disabled">
		<slot></slot>
		<!-- Default slot for button text -->
	</button>
</template>

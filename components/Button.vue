<script setup>
	import { cn } from '../lib/utils'
	const props = defineProps({
		type: {
			type: String,
			default: 'primary',
		},
		disabled: Boolean,
		isLink: Boolean,
		to: {
			type: String,
			default: null,
		},
		href: {
			type: String,
			default: null,
		},
	})

	const { type, disabled } = toRefs(props)
	const attrs = useAttrs()

	const buttonClasses = computed(() => {
		const baseClasses = 'inline-flex items-center rounded px-2.5 py-1.5 text-xs font-medium shadow-sm'
		const typeClasses = {
			primary: 'bg-neutral-600 text-white hover:bg-neutral-700',
			secondary: 'bg-green-500 text-white hover:bg-green-600',
		}

		const disabledClasses = 'opacity-50 cursor-not-allowed'
		return cn(baseClasses, typeClasses[type.value] || '', disabled.value ? disabledClasses : '', attrs.class || '')
	})

	const componentTag = computed(() => (props.isLink ? resolveComponent('NuxtLink') : 'button'))
	const linkAttribute = computed(() => (props.to ? { to: props.to } : { href: props.href }))

	const combinedAttributes = computed(() => {
		return {
			...attrs,
			...linkAttribute.value,
			class: buttonClasses.value,
		}
	})
</script>

<template>
	<component :is="componentTag" v-bind="combinedAttributes">
		<slot></slot>
	</component>
</template>

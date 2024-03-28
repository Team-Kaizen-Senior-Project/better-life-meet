<script setup lang="ts">
	import type { HTMLAttributes } from 'vue'
	import { Primitive, type PrimitiveProps } from 'radix-vue'
	import { type ButtonVariants, buttonVariants } from '.'
	import { cn } from '~/lib/utils'

	interface Props extends PrimitiveProps {
		variant?: ButtonVariants['variant']
		size?: ButtonVariants['size']
		class?: HTMLAttributes['class']
		loading?: boolean
		disabled?: boolean
	}

	const props = withDefaults(defineProps<Props>(), {
		as: 'button',
	})
</script>

<template>
	<Primitive
		:as="as"
		:as-child="asChild"
		:disabled="loading || disabled"
		:class="cn(buttonVariants({ variant, size }), props.class)"
	>
		<Loader v-if="loading" />
		<slot />
	</Primitive>
</template>

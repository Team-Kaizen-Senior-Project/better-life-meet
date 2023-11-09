<template>
	<div class="border border-dashed p-3" :class="borderClass">
		<div class="grid gap-2">
			<div class="text-md font-medium text-white">{{ meeting.title }}</div>
			<div class="grid gap-1">
				<p class="text-sm text-zinc-300">{{ meeting.date }}</p>
				<p class="text-sm text-zinc-300">{{ meeting.time }}</p>
			</div>
		</div>
		<div class="flex w-full items-center justify-between">
			<div></div>
			<!-- Spacer -->
			<a
				:href="meeting.link"
				class="flex h-8 gap-2 rounded-md px-3 py-2 font-['Inter'] text-sm font-medium leading-tight text-white shadow"
				:class="buttonClass"
			>
				Join
			</a>
		</div>
	</div>
</template>

<script setup>
	import { computed } from 'vue'

	const props = defineProps({
		meeting: Object,
		isLive: Boolean,
	})

	const borderClass = computed(() => (props.isLive ? 'border-emerald-600' : 'border-white'))
	const buttonClass = computed(() => (props.isLive ? 'bg-sky-500 hover:bg-sky-600' : 'bg-zinc-700'))
</script>

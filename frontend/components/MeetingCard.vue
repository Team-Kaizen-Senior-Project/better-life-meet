<script setup>
	const props = defineProps({
		meeting: Object,
		isLive: Boolean,
	})
	const video = useVideoStore()

	const borderClass = computed(() => (props.isLive ? 'border-emerald-600' : 'border-white'))
	const buttonClass = computed(() => (props.isLive ? 'bg-sky-500 hover:bg-sky-600' : 'bg-zinc-700'))
</script>

<template>
	<div class="rounded-lg bg-zinc-800 p-4" :class="borderClass">
		<div class="grid gap-2">
			<div class="text-sm font-medium text-white">{{ meeting.title }}</div>
			<div class="grid gap-1">
				<p class="text-sm text-zinc-300">{{ meeting.date }}</p>
				<p class="text-sm text-zinc-300">{{ meeting.time }}</p>
			</div>
		</div>
		<div class="flex w-full items-center justify-between">
			<NuxtLink
				:to="`/meeting/${meeting.id}`"
				class="mt-4 flex gap-2 rounded-md px-3 py-2 text-sm font-medium leading-tight text-white shadow"
				:class="buttonClass"
				@click="video.joinMeeting"
			>
				Join
			</NuxtLink>
		</div>
	</div>
</template>

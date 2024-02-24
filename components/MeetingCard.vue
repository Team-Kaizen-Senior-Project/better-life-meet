<script setup lang="ts">
	import type { Meeting } from '~/types'
	const { display: displayDate, dayjs } = useDate()
	const { deleteMeeting: deleteMeetingApi } = useApi()
	const { state: customerState, isLeader } = usePodStore()
	const pod = customerState.pod!

	const deleting = ref<boolean>(false)

	const props = defineProps<{
		meeting?: Meeting
	}>()

	const emit = defineEmits<{
		refresh: []
	}>()

	const video = useVideoStore()

	const isLive = computed(() => {
		if (!props.meeting) return false
		const start = props.meeting.startTime
		const end = props.meeting.endTime
		return dayjs().isBetween(start.isoString, end.isoString)
	})

	const borderClass = computed(() => (isLive.value ? 'border-emerald-600' : 'border-white'))
	const buttonClass = computed(() => (isLive.value ? 'bg-sky-500 hover:bg-sky-600' : 'bg-zinc-700'))

	const deleteMeeting = async () => {
		if (!props.meeting) return
		deleting.value = true
		try {
			await deleteMeetingApi(props.meeting.id)
			emit('refresh')
		} catch (error) {
			console.log('error deleting the meeting', error)
		} finally {
			deleting.value = false
		}
	}
</script>

<template>
	<div class="rounded-lg bg-zinc-800 p-4" :class="borderClass">
		<div class="grid gap-2">
			<div class="text-sm font-medium text-white">{{ meeting?.timeZone }}</div>
			<div class="grid gap-1">
				<p class="text-sm text-zinc-300">{{ displayDate(meeting?.startTime?.isoString) }}</p>
			</div>
		</div>
		<div class="mt-4 flex w-full items-center justify-between">
			<NuxtLink
				:to="`/meeting/${meeting?.id}`"
				class="flex gap-2 rounded-md px-3 py-2 text-sm font-medium leading-tight text-white shadow"
				:class="buttonClass"
				@click="video.joinMeeting"
			>
				Join
			</NuxtLink>
			<button
				v-if="isLeader && pod.id === meeting?.podRef?.id"
				class="rounded-md bg-red-600 px-3 py-2 text-sm font-medium leading-tight text-white shadow"
				@click="deleteMeeting"
			>
				Delete
				<span v-if="deleting">deleting...</span>
			</button>
		</div>
	</div>
</template>

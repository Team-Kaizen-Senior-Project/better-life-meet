<script setup lang="ts">
	import type { Meeting } from '~/types'
	const { display: displayDate, displayHours, dayjs } = useDate()
	const { deleteMeeting: deleteMeetingApi } = useApi()
	const { state: customerState } = usePodStore()
	// computed and refs should not be directly destructed, instead use whole store or `storeToRefs`
	// https://pinia.vuejs.org/core-concepts/#Destructuring-from-a-Store
	const { isLeader } = storeToRefs(usePodStore())
	const pod = computed(() => customerState.pod)

	const deleting = ref<boolean>(false)

	const props = defineProps<{
		meeting: Meeting
		isFirst: boolean
	}>()

	const emit = defineEmits<{
		refresh: []
	}>()

	const video = useVideoStore()

	const isLive = computed(() => {
		if (!props.meeting) return false
		const start = props.meeting.startTime
		const end = props.meeting.endTime
		if (!start || !end) return false
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

	const showJoinButton = computed(() => {
		if (!props.meeting) return false
		const startTime = dayjs(props.meeting.startTime.isoString)
		const endTime = dayjs(props.meeting.endTime.isoString)
		const now = dayjs()
		const fifteenMinutesBeforeStart = startTime.subtract(15, 'minute')
		return now.isAfter(fifteenMinutesBeforeStart) && now.isBefore(endTime)
	})

	const countdown = ref('')

	const updateCountdown = () => {
		if (!props.meeting) {
			countdown.value = ''
			return
		}
		const startTime = dayjs(props.meeting.startTime.isoString)
		const now = dayjs()
		if (now.isAfter(startTime)) {
			countdown.value = 'Meeting has started'
			return
		}
		const duration = dayjs.duration(startTime.diff(now))
		countdown.value = `Starts in ${duration.days()}d ${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`
	}

	const interval = ref<NodeJS.Timeout | undefined>()

	onMounted(() => {
		updateCountdown()
		interval.value = setInterval(updateCountdown, 1000)
	})

	onUnmounted(() => {
		clearInterval(interval.value)
	})
</script>

<template>
	<div class="rounded-lg bg-zinc-800 p-4" :class="borderClass">
		<div class="grid gap-2">
			<div class="text-sm font-medium text-white">Pod accountability meeting</div>
			<div class="grid gap-2">
				<p class="text-sm text-zinc-300">{{ displayDate(meeting?.startTime.isoString) }}</p>
				<p class="text-sm text-zinc-300">
					<span>{{ displayHours(meeting?.startTime.isoString) }} - {{ displayHours(meeting?.endTime.isoString) }}</span>
				</p>
				<p
					v-if="props.isFirst"
					class="inline-flex max-w-fit items-center rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-400 ring-1 ring-inset ring-green-500/20"
				>
					{{ countdown }}
				</p>
			</div>
		</div>
		<div class="mt-4 flex w-full items-center" :class="showJoinButton ? 'justify-between' : 'justify-end'">
			<NuxtLink
				v-if="showJoinButton"
				:to="`/meeting/${meeting?.id}`"
				class="flex gap-2 rounded-md px-3 py-2 text-sm font-medium leading-tight text-white shadow"
				:class="buttonClass"
				@click="video.joinMeeting"
			>
				Join
			</NuxtLink>
			<button
				v-if="isLeader && pod && pod.id === meeting?.podRef?.id"
				class="rounded-md bg-red-600 px-3 py-2 text-sm font-medium leading-tight text-white shadow"
				@click="deleteMeeting"
			>
				Delete
				<span v-if="deleting">deleting...</span>
			</button>
		</div>
	</div>
</template>

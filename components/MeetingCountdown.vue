<script setup lang="ts">
	const { display: displayDate, dayjs } = useDate()
	import { useCountdownStore } from '~/stores/CountdownStore'
	import type { Meeting, Time } from '~/types'
	const countdownStore = useCountdownStore()
	const video = useVideoStore()
	const props = defineProps<{
		meetingStartTime: Time
	}>()
	const countdown = ref('')

	const updateCountdown = () => {
		const startTime = dayjs(props.meetingStartTime.isoString)
		const now = dayjs()
		if (startTime.isBefore(now)) {
			console.log('countdown has finished')
			countdown.value = '0d 0h 0m 0s'
			countdownStore.setShowCountdown(false)
			video.setModalOpen(true)
			clearInterval(interval) // Stop the countdown
		} else {
			const duration = dayjs.duration(startTime.diff(now))
			countdown.value = `${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`
		}
	}
	let interval: any = null
	onMounted(() => {
		updateCountdown()
		interval = setInterval(updateCountdown, 1000)
	})

	onUnmounted(() => {
		clearInterval(interval)
	})
</script>

<template>
	<div
		class="countdown-wrapper flex flex-col items-center justify-center rounded-lg border border-dashed bg-gray-800 px-40 py-20 text-white"
	>
		<div class="label text-sm-lg mb-2">Starting in</div>
		<span class="text-xl font-bold text-white" data-testid="countdown">{{ countdown }}</span>
	</div>
</template>

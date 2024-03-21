<script setup lang="ts">
	import { ref } from 'vue'
	import dayjs from 'dayjs'
	import type { Meeting, Time } from '~/types'
	const videoRef = ref()
	const props = defineProps<{
		meetingStartTime: Time
	}>()
	const emit = defineEmits(['toggleVideo'])
	const calculateTimeDifferenceInSeconds = (startTime): number => {
		const now = new Date()
		const start = new Date(startTime)
		const difference = now.getTime() - start.getTime()
		return Math.floor(difference / 1000)
	}
	const now = dayjs()
	const startTime = dayjs(props.meetingStartTime.isoString)

	if (videoRef.value) {
		console.log('hello')
		const timeLag = calculateTimeDifferenceInSeconds(startTime)
		videoRef.value.addEventListener('loadedmetadata', () => {
			if (timeLag > 0 && timeLag < videoRef.value.duration) {
				videoRef.value.currentTime = timeLag
				videoRef.value.play()
			} else if (timeLag >= videoRef.value.duration) {
				emit('toggleVideo')
			} else {
				videoRef.value.play()
			}
		})
	}
	console.log(videoRef.value)
</script>

<template>
	<div>
		<video
			ref="videoRef"
			@ended="emit('toggleVideo')"
			controls
			contextmenu="disabled"
			playsinline="true"
			src="/assets/a.mp4"
			class="mx-auto max-h-[80vh] w-full rounded-lg bg-zinc-900 lg:w-[90%]"
		></video>
	</div>
</template>

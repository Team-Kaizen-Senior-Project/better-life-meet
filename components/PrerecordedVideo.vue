<script setup lang="ts">
	import { ref } from 'vue'
	import dayjs from 'dayjs'
	import type { Meeting, Time } from '~/types'
	const videoRef = ref<HTMLVideoElement | null>(null)
	const props = defineProps<{
		meetingStartTime: Time
	}>()
	const emit = defineEmits(['toggleVideo'])
	const calculateTimeDifferenceInSeconds = (startTime: string): number => {
		const now = dayjs()
		const start = dayjs(startTime)
		const difference = now.diff(start, 'second')
		return difference
	}
	onMounted(() => {
		if (!videoRef.value) return

		const startTime = props.meetingStartTime.isoString
		const timeDifferenceInSeconds = calculateTimeDifferenceInSeconds(startTime)

		videoRef.value.onloadedmetadata = () => {
			const videoDuration = videoRef.value.duration
			if (timeDifferenceInSeconds < videoDuration) {
				videoRef.value.currentTime = timeDifferenceInSeconds
			} else {
				console.log('User is too late to watch the video.')
				emit('toggleVideo')
			}
		}
	})
</script>

<template>
	<div>
		<video
			ref="videoRef"
			@ended="emit('toggleVideo')"
			controls
			contextmenu="disabled"
			autoplay
			playsinline="true"
			src="/assets/a.mp4"
			class="mx-auto max-h-[80vh] w-full rounded-lg bg-zinc-900 lg:w-[90%]"
		></video>
	</div>
</template>

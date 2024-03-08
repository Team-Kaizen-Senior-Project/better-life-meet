<script setup lang="ts">
	import { io } from 'socket.io-client'
	const recordedVideoIsPlaying = ref(true)
	import { useCountdownStore } from '~/stores/CountdownStore'
	import { useVideoStore } from '~/stores/videoService'
	import type { Meeting} from '~/types'
	import dayjs from 'dayjs'
	const { display: displayDate } = useDate()
	const video = useVideoStore()
	const { state: customerState } = useCustomerStore()

	definePageMeta({
		layout: 'meeting',
	})
	const countdown = useCountdownStore()
	const route = useRoute()
	const meetingId = route.params.id
	const { getMeeting } = useApi()
	const meeting: Meeting = await getMeeting(meetingId)
	const showBufferText = ref(false)

	const customerRef = customerState.customer?.id

	const startTime = dayjs(meeting.startTime.isoString)
	const now = dayjs()

	if (now.isBefore(startTime)) {
		countdown.setShowCountdown(true)
		console.log('before')
	}
	console.log(meeting)
	console.log('Now', now)
	console.log('Start Time', startTime)

	// Initiate socket connection
	const ws = io()
	
	function toggleVideo() {
		showBufferText.value = true
		// Temp buffer for video end
		const BUFFER = 5 // seconds
		setTimeout(() => {
			recordedVideoIsPlaying.value = false
			video.setModalOpen(true)
			showBufferText.value = false
		}, BUFFER * 1000)
	}
	ws.emit('joinMeeting', { customerRef, meetingId, isCameraOn: video.cameraActive })

	//watch video camera status
	watch(
		() => ({ cameraActive: video.cameraActive }),
		(newVal) => {
			if (newVal.cameraActive) {
				ws.emit('toggleVideo')
			}
		},
	)

	onUnmounted(() => {
		ws.close()
	})
</script>

<template>
	<PodHeader />
	<div class="flex min-h-[82vh] items-center justify-center bg-zinc-800">
		<MeetingCountdown v-if="countdown.showCountdown" :meetingStartTime="meeting.startTime" />
		<div v-if="showBufferText" class="rounded-lg bg-zinc-900 p-6 text-center text-white">
			<p class="font-semibold">Please wait</p>
			<p>The meeting will start shortly</p>
		</div>
		<div v-if="recordedVideoIsPlaying && !showBufferText && !countdown.showCountdown" class="flex flex-row">
			<PrerecordedVideo @toggle-video="toggleVideo" />
		</div>
		<div v-else-if="!recordedVideoIsPlaying" class="grid h-[70vh] w-[80vw] grid-cols-4 grid-rows-2 gap-3">
			<!-- Local user's video feed -->
			<div class="relative overflow-hidden rounded-lg bg-zinc-900" v-if="true">
				<LocalVideo />
				<p class="absolute bottom-0 left-0 bg-black px-2 py-1.5 text-white">Local User</p>
			</div>
			<!-- External users' video feeds placeholder -->
		</div>
		<div class="flex justify-end p-4">
			<ChatBox />
		</div>
	</div>

	<BreakoutRoomModal v-if="!recordedVideoIsPlaying" :meetingRef="meetingId" />
	<PodFooter />
</template>

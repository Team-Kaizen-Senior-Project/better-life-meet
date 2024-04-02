<script setup lang="ts">
	const recordedVideoIsPlaying = ref(true)
	import { useCountdownStore } from '~/stores/CountdownStore'
	import { useVideoStore } from '~/stores/videoService'
	import type { Meeting } from '~/types'
	import dayjs from 'dayjs'
	const { display: displayDate } = useDate()
	const video = useVideoStore()
	const { leaveRoom, isConnected } = getHmsInstance()

	definePageMeta({
		layout: 'meeting',
	})
	const countdown = useCountdownStore()
	const route = useRoute()
	const meetingId = route.params.id
	const { getMeeting } = useApi()
	const meeting: Meeting = await getMeeting(meetingId)
	const showBufferText = ref(false)

	const { state: customerState } = useCustomerStore()
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

	onUnmounted(() => {
		if (isConnected.value) {
			leaveRoom()
		}
	})
</script>

<template>
	<PodHeader />
	<div class="bg-zinc-800 py-8">
		<div class="flex items-center justify-center">
			<MeetingCountdown v-if="countdown.showCountdown" :meetingStartTime="meeting.startTime" />
			<div v-if="showBufferText" class="rounded-lg bg-zinc-900 p-6 text-center text-white">
				<p class="font-semibold">Please wait</p>
				<p>The meeting will start shortly</p>
			</div>
			<div v-if="recordedVideoIsPlaying && !showBufferText && !countdown.showCountdown" class="flex flex-row">
				<PrerecordedVideo @toggle-video="toggleVideo" :meetingStartTime="meeting.startTime" />
			</div>
			<div
				v-else-if="!recordedVideoIsPlaying"
				class="relative max-h-[70vh] xl:max-h-[85vh] w-[90%] overflow-y-auto rounded-lg bg-zinc-900 p-8 lg:w-[85%] 2xl:w-[80%]"
			>
				<MeetingVideo v-if="!video.modalOpen" :roomCode="meeting.roomCode" />
			</div>
			<div class="flex justify-end p-4">
				<ChatBox />
			</div>
		</div>
	</div>

	<BreakoutRoomModal v-if="!recordedVideoIsPlaying" :meetingRef="meetingId" />
	<PodFooter />
</template>

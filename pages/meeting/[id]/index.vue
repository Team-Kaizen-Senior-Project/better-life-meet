<script setup lang="ts">
	import { io } from 'socket.io-client'
	const recordedVideoIsPlaying = ref(true)
	import { useCountdownStore } from '~/stores/CountdownStore'
	import { useVideoStore } from '~/stores/videoService'
	const video = useVideoStore()

	definePageMeta({
		layout: 'meeting',
	})
	const route = useRoute()
	const meetingId = computed(() => route.params.id)
	const { getMeeting } = useApi()
	const {
		data: meeting,
		refresh,
		pending,
	} = await useAsyncData(`meeting-${meetingId.value}`, () => getMeeting(meetingId.value))

	const { countdown, hasStarted } = useMeetingCountdown({
		startTime: computed(() => meeting.value?.startTime.isoString),
		onMeetingStart: () => {
			video.setModalOpen(true)
		},
	})

	const showBufferText = ref(false)

	// Connect to websocket server
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
</script>

<template>
	<PodHeader />
	<div class="flex min-h-[82vh] items-center justify-center bg-zinc-800">
		<!-- <MeetingCountdown v-if="countdown.showCountdown" :meetingStartTime="meeting.startTime" /> -->
		<div
			v-if="!hasStarted"
			className="flex flex-col items-center justify-center rounded-lg  bg-zinc-900 px-40 py-20 text-white"
		>
			<p className="text-2xl font-medium">{{ countdown }}</p>
		</div>
		<div v-if="showBufferText" class="rounded-lg bg-zinc-900 p-6 text-center text-white">
			<p class="font-semibold">Please wait</p>
			<p>The meeting will start shortly</p>
		</div>
		<PrerecordedVideo @toggle-video="toggleVideo" v-if="recordedVideoIsPlaying && !showBufferText && hasStarted" />
		<div v-else-if="!recordedVideoIsPlaying" class="grid h-[70vh] w-[80vw] grid-cols-4 grid-rows-2 gap-3">
			<!-- Local user's video feed -->
			<div class="relative overflow-hidden rounded-lg bg-zinc-900" v-if="true">
				<LocalVideo />
				<p class="absolute bottom-0 left-0 bg-black px-2 py-1.5 text-white">Local User</p>
			</div>

			<!-- External users' video feeds -->
			<!-- <div class="relative overflow-hidden rounded-lg bg-zinc-900" v-for="stream in externalStreams" :key="stream.id">
				<ExternalVideo :stream="stream.stream" />
				<p class="absolute bottom-0 left-0 bg-black px-2 py-1.5 text-white">{{ stream.id }}</p>
			</div> -->
		</div>
	</div>
	<BreakoutRoomModal v-if="!recordedVideoIsPlaying" :meetingRef="meetingId" />
	<PodFooter />
</template>

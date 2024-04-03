<script setup lang="ts">
	import { useVideoStore } from '~/stores/videoService'

	const video = useVideoStore()
	const recordedVideoIsPlaying = ref(true)
	const { leaveRoom, isConnected } = getHmsInstance()

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

	const effectiveVimeoId = computed(() => {
		return meeting.value?.vimeoId || '557876585'
	})

	onUnmounted(() => {
		if (isConnected.value) {
			leaveRoom()
		}
		location.reload()
	})
</script>

<template>
	<PodHeader />
	<div class="bg-zinc-800">
		<!-- <MeetingCountdown v-if="countdown.showCountdown" :meetingStartTime="meeting.startTime" /> -->
		<inner-column>
			<div class="flex min-h-[82vh] items-center justify-center">
				<div
					v-if="!hasStarted"
					className="flex flex-col items-center justify-center rounded-lg  bg-zinc-900 px-40 py-20 text-white"
				>
					<p className="text-2xl font-medium">{{ countdown }}</p>
				</div>
				<div v-if="showBufferText" class="mx-auto max-w-fit rounded-lg bg-zinc-900 p-6 text-center text-white">
					<p class="font-semibold">Please wait</p>
					<p>The meeting will start shortly</p>
				</div>
				<PrerecordedVideo
					@toggle-video="toggleVideo"
					v-if="recordedVideoIsPlaying && !showBufferText && hasStarted"
					:vimeoId="effectiveVimeoId"
				/>
				<div v-else-if="!recordedVideoIsPlaying" class="">
					<!-- Local user's video feed -->
					<div class="relative overflow-y-auto rounded-lg bg-zinc-900" v-if="true">
						<MeetingVideo v-if="!video.modalOpen" :roomCode="meeting?.roomCode" />
					</div>
				</div>
				<div class="" v-if="!recordedVideoIsPlaying">
					<ChatBox />
				</div>
			</div>
		</inner-column>
	</div>

	<BreakoutRoomModal v-if="!recordedVideoIsPlaying" :meetingRef="meetingId" />
	<PodFooter />
</template>

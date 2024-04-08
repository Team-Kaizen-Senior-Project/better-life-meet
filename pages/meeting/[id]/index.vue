<script setup lang="ts">
const meetingStore = useMeetingStore()
const media = useMediaStore()
const recordedVideoIsPlaying = ref(false)
const { leaveRoom, isConnected } = useHms()

definePageMeta({
	layout: 'meeting',
})
const route = useRoute()
const meetingId = computed(() => route.params.id as string)
const { getMeeting } = useApi()
const {
	data: meeting,
	refresh,
	pending,
} = await useAsyncData(`meeting-${meetingId.value}`, () => getMeeting(meetingId.value))

const { countdown, hasStarted } = useMeetingCountdown({
	startTime: computed(() => meeting.value?.startTime.isoString),
	onMeetingStart: () => {
		if (meetingStore.getHasViewedVideo(meetingId.value)) {
			media.setModalOpen(true)
		} else {
			recordedVideoIsPlaying.value = true
		}
	},
})

const showBufferText = ref(false)

function toggleVideo() {
	meetingStore.viewVideo(meetingId.value)
	showBufferText.value = true
	// Temp buffer for video end
	const BUFFER = 5 // seconds
	setTimeout(() => {
		recordedVideoIsPlaying.value = false
		media.setModalOpen(true)
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
	// location.reload()
})
</script>

<template>
	<PodHeader />
	<div class="bg-zinc-800">
		<!-- <MeetingCountdown v-if="countdown.showCountdown" :meetingStartTime="meeting.startTime" /> -->
		<inner-column>
			<div class="flex min-h-[82vh] items-center justify-center">
				<div v-if="!hasStarted"
					className="flex flex-col items-center justify-center rounded-lg  bg-zinc-900 px-40 py-20 text-white">
					<p className="text-2xl font-medium">{{ countdown }}</p>
				</div>
				<div v-else-if="showBufferText"
					class="mx-auto max-w-fit rounded-lg bg-zinc-900 p-6 text-center text-white">
					<p class="font-semibold">Please wait</p>
					<p>The meeting will start shortly</p>
				</div>
				<PrerecordedVideo v-else-if="recordedVideoIsPlaying" :vimeoId="effectiveVimeoId"
					@toggle-video="toggleVideo" />
				<div v-else>
					<!-- Local user's video feed -->
					<div class="relative overflow-y-auto rounded-lg bg-zinc-900">
						<div v-if="!isConnected" class="flex flex-col items-center justify-center p-6 text-white">
							<p class="font-semibold">Please wait</p>
							<p>Connecting to the meeting</p>
							<Loader class="mt-4" />
						</div>
						<MeetingVideo v-if="!media.state.modalOpen" :roomCode="meeting?.roomCode" />
					</div>

					<div>
						<ChatBox />
					</div>
				</div>
			</div>
		</inner-column>
	</div>

	<BreakoutRoomModal v-if="!recordedVideoIsPlaying" :meetingRef="meetingId" />
	<PodFooter />
</template>

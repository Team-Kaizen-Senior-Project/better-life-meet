<script setup lang="ts">
	import { useWindowSize } from '@vueuse/core'
	import { useLeaveModalStore } from '../../../stores/LeaveMeetingStore'
	import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '~/components/ui/resizable'
	definePageMeta({
		layout: 'meeting',
	})
	const meetingStore = useMeetingStore()
	const media = useMediaStore()
	const chatbox = useChatboxStore()

	const recordedVideoIsPlaying = ref(false)
	const recordedVideo = ref<any | undefined>(undefined)
	const recordedVideoStartAt = ref<number>(0)
	const loadingRecordedVideo = ref(false) // this loading is for getting the url of the recorded video
	const { leaveRoom, isConnected } = useHms()
	const leaveMeetingModal = useLeaveModalStore()

	const isLeaveModalOpen = computed(() => leaveMeetingModal.isLeaveModalOpen)

	const route = useRoute()
	const meetingId = computed(() => route.params.id as string)
	const { getMeeting, getVimeoVideo } = useApi()
	const {
		data: meeting,
		refresh,
		pending,
	} = await useAsyncData(`meeting-${meetingId.value}`, () => getMeeting(meetingId.value))

	const { countdown, hasStarted } = useMeetingCountdown({
		startTime: computed(() => meeting.value?.startTime.isoString),
		onMeetingStart: async ({ elapsedMeetingTime }) => {
			// TODO: implement a loading state
			try {
				loadingRecordedVideo.value = true
				const video = (await getVimeoVideo(effectiveVimeoId.value)) as any

				// Set video
				recordedVideo.value = video

				const videoDuration = video.duration // in seconds

				const elapsedSeconds = elapsedMeetingTime / 1000

				// meeting time is less than meeting, start live meeting
				if (elapsedSeconds > videoDuration) {
					console.log('meeting elapsed longer than video duration, start meeting')

					media.setModalOpen(true)
					return
				}

				// start recorded video
				console.log('Video duration is longer than meeting elapsed time, show video')

				recordedVideoStartAt.value = elapsedSeconds
				recordedVideoIsPlaying.value = true
			} catch (error) {
				console.log('error loading recorded video')
			} finally {
				loadingRecordedVideo.value = false
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
		return meeting.value?.vimeoId || '523363936'
	})

	const { width } = useWindowSize({
		includeScrollbar: true, // Considers the scrollbar in the width calculation if it's visible
		listenOrientation: true, // Handles orientation changes in devices
	})

	const panelDirection = computed(() => {
		return width.value < 768 ? 'vertical' : 'horizontal' //  768px as a breakpoint for mobile devices
	})

	function handleBeforeUnload(event: BeforeUnloadEvent) {
		if (isConnected.value) {
			event.preventDefault()
		}
	}

	function handleUnload() {
		if (isConnected.value) {
			leaveRoom()
		}
	}

	onMounted(() => {
		window.addEventListener('beforeunload', handleBeforeUnload)
		window.addEventListener('unload', handleUnload)
	})

	onUnmounted(() => {
		window.removeEventListener('beforeunload', handleBeforeUnload)
		window.removeEventListener('unload', handleUnload)
	})

	// when user attempts to press the back button
	onBeforeRouteLeave(async (to, from) => {
		// close modal when leaving meeting page, if modal is open it shows initially when you join back to meeting
		media.setModalOpen(false)
		if (isConnected.value) {
			leaveMeetingModal.toggleLeaveModal()
			return false
		}
	})
</script>

<template>
	<ResizablePanelGroup :direction="panelDirection" class="video-section mx-auto max-w-[1200px] gap-2">
		<ResizablePanel :style="{ overflowY: 'auto' }">
			<section class="grid place-items-center bg-zinc-800 py-4">
				<!-- <MeetingCountdown v-if="countdown.showCountdown" :meetingStartTime="meeting.startTime" /> -->
				<inner-column>
					<div>
						<div
							v-if="loadingRecordedVideo"
							class="flex items-center justify-center rounded-lg bg-zinc-900 px-40 py-20 text-white"
						>
							Loading Meeting
						</div>
						<div
							v-else-if="!hasStarted"
							className="flex flex-col items-center justify-center rounded-lg  bg-zinc-900 px-40 py-20 text-white"
						>
							<p className="text-2xl font-medium">{{ countdown }}</p>
						</div>
						<div v-else-if="showBufferText" class="mx-auto max-w-fit rounded-lg bg-zinc-900 p-6 text-center text-white">
							<p class="font-semibold">Please wait</p>
							<p>The meeting will start shortly</p>
						</div>
						<PrerecordedVideo
							v-else-if="recordedVideoIsPlaying"
							:video="recordedVideo"
							:startAt="recordedVideoStartAt"
							@toggle-video="toggleVideo"
						/>
						<div v-else class="md:flex-end flex w-full flex-col md:flex-row">
							<!-- Local user's video feed -->
							<div class="relative w-full overflow-y-auto rounded-lg bg-zinc-900">
								<div v-if="!isConnected" class="flex flex-col items-center justify-center p-6 text-white">
									<p class="font-semibold">Please wait</p>
									<p>Connecting to the meeting</p>
									<Loader class="mt-4" />
								</div>
								<MeetingVideo v-if="!media.state.modalOpen" :roomCode="meeting?.roomCode" />
							</div>
						</div>
					</div>
				</inner-column>
			</section>
		</ResizablePanel>
		<BreakoutRoomModal :meetingRef="meetingId" />
		<ResizableHandle :class="{ hidden: !chatbox.isChatBoxVisible }" class="bg-transparent" />
		<ResizablePanel
			:default-size="30"
			:max-size="45"
			:minSize="30"
			:class="{ hidden: !chatbox.isChatBoxVisible }"
			class=""
		>
			<ChatBox />
		</ResizablePanel>
	</ResizablePanelGroup>
</template>

<style scoped>
	.video-section {
		scrollbar-width: thin;
		scrollbar-color: #3f3f46 transparent;
	}
</style>

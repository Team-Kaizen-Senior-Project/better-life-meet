<script setup lang="ts">
	import { useLeaveModalStore } from '../../../stores/LeaveMeetingStore'

	const meetingStore = useMeetingStore()
	const media = useMediaStore()
	const chatbox = useChatboxStore()
	const recordedVideoIsPlaying = ref(false)
	const { leaveRoom, isConnected } = useHms()
	const leaveMeetingModal = useLeaveModalStore()
	import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
	const isLeaveModalOpen = computed(() => leaveMeetingModal.isLeaveModalOpen)
	definePageMeta({
		layout: 'meeting',
	})
	const route = useRoute()
	const meetingId = computed(() => route.params.id as string)
	const windowWidth = ref(window.innerWidth)

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
	const isMobile = computed(() => windowWidth.value < 650)

	function updateWindowWidth() {
		windowWidth.value = window.innerWidth
	}
	onMounted(() => {
		window.addEventListener('resize', updateWindowWidth)
		window.addEventListener('beforeunload', handleBeforeUnload)
		window.addEventListener('unload', handleUnload)
	})

	onUnmounted(() => {
		window.removeEventListener('resize', updateWindowWidth)
		window.removeEventListener('beforeunload', handleBeforeUnload)
		window.removeEventListener('unload', handleUnload)
	})

	// when user attempts to press the back button
	onBeforeRouteLeave(async (to, from) => {
		if (isConnected.value) {
			leaveMeetingModal.toggleLeaveModal()
			return false
		}
	})
</script>

<template>
	<div class="overlow-x-hidden max-h-screen overflow-y-hidden">
		<PodHeader />
		<ResizablePanelGroup direction="vertical" class="max-w-screen max-h-screen min-h-screen" v-if="isMobile">
			<ResizablePanel>
				<div class="bg-zinc-800">
					<!-- <MeetingCountdown v-if="countdown.showCountdown" :meetingStartTime="meeting.startTime" /> -->
					<inner-column>
						<div class="flex items-center justify-center">
							<div
								v-if="!hasStarted"
								class="flex flex-col items-center justify-center rounded-lg bg-zinc-900 px-40 py-20 text-white"
							>
								<p class="text-2xl font-medium">{{ countdown }}</p>
							</div>
							<div
								v-else-if="showBufferText"
								class="mx-auto max-w-fit rounded-lg bg-zinc-900 p-6 text-center text-white"
							>
								<p class="font-semibold">Please wait</p>
								<p>The meeting will start shortly</p>
							</div>
							<PrerecordedVideo
								v-else-if="recordedVideoIsPlaying"
								:vimeoId="effectiveVimeoId"
								@toggle-video="toggleVideo"
							/>
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
							</div>
						</div>
					</inner-column>
				</div>
			</ResizablePanel>
			<BreakoutRoomModal v-if="!recordedVideoIsPlaying" :meetingRef="meetingId" />
			<ResizableHandle :class="{ hidden: !chatbox.isChatBoxVisible }" />
			<ResizablePanel :class="{ hidden: !chatbox.isChatBoxVisible }">
				<ChatBox />
			</ResizablePanel>
		</ResizablePanelGroup>

		<ResizablePanelGroup direction="horizontal" class="max-w-screen max-h-screen min-h-screen" v-else>
			<ResizablePanel>
				<div class="bg-zinc-800">
					<!-- <MeetingCountdown v-if="countdown.showCountdown" :meetingStartTime="meeting.startTime" /> -->
					<inner-column>
						<div class="flex min-h-[82vh] items-center justify-center">
							<div
								v-if="!hasStarted"
								class="flex flex-col items-center justify-center rounded-lg bg-zinc-900 px-40 py-20 text-white"
							>
								<p class="text-2xl font-medium">{{ countdown }}</p>
							</div>
							<div
								v-else-if="showBufferText"
								class="mx-auto max-w-fit rounded-lg bg-zinc-900 p-6 text-center text-white"
							>
								<p class="font-semibold">Please wait</p>
								<p>The meeting will start shortly</p>
							</div>
							<PrerecordedVideo
								v-else-if="recordedVideoIsPlaying"
								:vimeoId="effectiveVimeoId"
								@toggle-video="toggleVideo"
							/>
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
							</div>
						</div>
					</inner-column>
				</div>
			</ResizablePanel>
			<BreakoutRoomModal v-if="!recordedVideoIsPlaying" :meetingRef="meetingId" />
			<ResizableHandle :class="{ hidden: !chatbox.isChatBoxVisible }" class="boxshadow-lg border-1 bg-gray-900" />
			<ResizablePanel :default-size="30" :class="{ hidden: !chatbox.isChatBoxVisible }">
				<ChatBox />
			</ResizablePanel>
		</ResizablePanelGroup>
		<PodFooter />
	</div>
</template>

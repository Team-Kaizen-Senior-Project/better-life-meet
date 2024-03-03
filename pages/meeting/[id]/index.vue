<script setup lang="ts">
	import { io, type Socket } from 'socket.io-client'
	const recordedVideoIsPlaying = ref(true)
	import { useCustomerStore } from '~/stores/CustomerStore'
	import { useCountdownStore } from '~/stores/CountdownStore'
	import { useVideoStore } from '~/stores/videoService'
	import type { Meeting, Chat } from '~/types'
	import dayjs from 'dayjs'
	const { display: displayDate } = useDate()
	const video = useVideoStore()
	const { state: customerState } = useCustomerStore()
	const customer = computed(() => customerState.customer)

	definePageMeta({
		layout: 'meeting',
	})
	const countdown = useCountdownStore()
	const route = useRoute()
	//const ws = ref<Socket>()
	const meetingId = route.params.id
	const { getMeeting } = useApi()
	const meeting: Meeting = await getMeeting(meetingId)
	const showBufferText = ref(false)

	const startTime = dayjs(meeting.startTime.isoString)
	const now = dayjs()

	const message = `Hellooo it's meeee, ${customer.value?.email}` // replace with ref later
	const chats = [] as string[] // replace with refs later

	if (now.isBefore(startTime)) {
		countdown.setShowCountdown(true)
		console.log('before')
	}
	console.log(meeting)
	console.log('Now', now)
	console.log('Start Time', startTime)
	// Connect to websocket server
	const ws = io()
	
	// Join Chat room
	ws.emit('joinChat', { roomId: meetingId, customer: `${customer.value?.email}` })
	
	// Listen for chat messages
	ws.on('message', (chat) => {
		console.log(chat)
		chats.push(chat)
	})
	// Send chat message
	ws.emit('chatMessage', {roomId: meetingId, chat: message})

	/* Send message utilize refs
	const sendMessage = async () => {
		ws.value?.emit('chatMessage', message)
		nextTick(() => {
			message = ''
		})
	}*/
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
		<MeetingCountdown v-if="countdown.showCountdown" :meetingStartTime="meeting.startTime" />
		<div v-if="showBufferText" class="rounded-lg bg-zinc-900 p-6 text-center text-white">
			<p class="font-semibold">Please wait</p>
			<p>The meeting will start shortly</p>
		</div>
		<PrerecordedVideo
			@toggle-video="toggleVideo"
			v-if="recordedVideoIsPlaying && !showBufferText && !countdown.showCountdown"
		/>
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

<script setup lang="ts">
	import { io } from 'socket.io-client'
	import { useCountdownStore } from '~/stores/CountdownStore'
	const { display: displayDate, dayjs } = useDate()

	definePageMeta({
		layout: 'meeting',
	})
	const countdown = useCountdownStore()
	const route = useRoute()
	const meetingId = route.params.id
	// const { getMeeting } = useApi()
	// const meeting: Meeting = await getMeeting(meetingId)
	const testingStartTime = '2024-02-24T23:21:00.000Z'
	const startTime = dayjs(testingStartTime)
	const now = dayjs()
	if (now.isBefore(startTime)) {
		countdown.setShowCountdown(true)
		console.log('before')
	}
	console.log('Now', now)
	console.log('Start Time', startTime)
	// Connect to websocket server
	const ws = io()
</script>

<template>
	<PodHeader />
	<div class="flex min-h-[82vh] items-center justify-center bg-zinc-800">
		<MeetingCountdown v-if="countdown.showCountdown" :meetingStartTime="testingStartTime" />
		<div v-else class="grid h-[70vh] w-[80vw] grid-cols-4 grid-rows-2 gap-3">
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
	<BreakoutRoomModal :meetingRef="meetingId" />
	<PodFooter />
</template>

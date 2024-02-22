<script setup lang="ts">
	import { io } from 'socket.io-client'
	import { useRouter, useRoute } from 'vue-router'
	import { onBeforeRouteLeave } from 'vue-router'
	const attendee = useAttendeeStore()

	definePageMeta({
		layout: 'meeting',
	})

	const route = useRoute()
	const meetingId = route.params.id

	// Connect to websocket server
	const ws = io()

	// When user attempts to close the tab
	window.onbeforeunload = function (e) {
		e.preventDefault()
		const answer = window.confirm('Are you ')
		if (!answer) {
			return false
		} else {
			attendee.logLeaveTime
		}
	}
	// when user attempts to press the back button
	onBeforeRouteLeave(async (to, from) => {
		const answer = window.confirm('Are you sure you want to leave the meeting?')
		if (!answer) {
			return false
		} else {
			attendee.logLeaveTime()
		}
	})
</script>

<template>
	<PodHeader />
	<div class="flex min-h-[82vh] items-center justify-center bg-zinc-800">
		<div class="grid h-[70vh] w-[80vw] grid-cols-4 grid-rows-2 gap-3">
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

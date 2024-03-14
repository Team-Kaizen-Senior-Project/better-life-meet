<script setup lang="ts">
	import { io } from 'socket.io-client'
	const recordedVideoIsPlaying = ref(true)
	import { useCountdownStore } from '~/stores/CountdownStore'
	import { useVideoStore } from '~/stores/videoService'
	import type { Meeting } from '~/types'
	import dayjs from 'dayjs'
	const { display: displayDate } = useDate()
	const video = useVideoStore()

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
</script>

<template>
	hi
	<Test />
</template>

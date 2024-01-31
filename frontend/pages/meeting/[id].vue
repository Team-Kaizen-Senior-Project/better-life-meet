<template></template>

<script setup lang="ts">
	import { io } from 'socket.io-client'
	import { Device } from 'mediasoup-client'
	import type { RtpCapabilities } from 'mediasoup-client/lib/types'

	const route = useRoute()
	const meetingId = route.params.id
	const ws = io({ path: '/wss' })

	const isConnected = await new Promise<boolean>((resolve) => {
		ws.on('connect', () => {
			ws.emit('join', meetingId, (response: boolean) => {
				resolve(response)
			})
		})
	})

	if (isConnected) {
		// Retrieve router RTP capabilities
		const routerRtpCapabilities = await new Promise<RtpCapabilities>((resolve) => {
			ws.emit('getRouterCapabilities', meetingId, (rtpCapabilities: RtpCapabilities) => {
				resolve(rtpCapabilities)
			})
		})

		// Load device with the router RTP capabilities
		const device = new Device()
		await device.load({ routerRtpCapabilities })

		// TODO: Create transports
		console.log(device.canProduce('video'))
		console.log(device.canProduce('audio'))
		console.log(device.sctpCapabilities)

		// device.createRecvTransport
	} else {
		console.error('Invalid meeting ID.')
	}
</script>

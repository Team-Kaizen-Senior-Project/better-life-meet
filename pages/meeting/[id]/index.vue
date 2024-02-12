<script setup lang="ts">
	import { io } from 'socket.io-client'
	import { Device } from 'mediasoup-client'
	import type { Producer, RtpCapabilities, TransportOptions } from 'mediasoup-client/lib/types'
	import { storeToRefs } from 'pinia'

	// Simulated array of external streams.
	// Each item in the array represents a stream object for an external user.
	const externalStreams = ref([
		{ id: 'user1', stream: undefined },
		{ id: 'user2', stream: undefined },
	])

	const route = useRoute()
	const meetingId = route.params.id

	definePageMeta({
		layout: 'meeting',
	})

	const mediaStore = useMediaStore()

	// Computed property to determine if there are any external streams
	const hasExternalStreams = computed(() => externalStreams.value.length > 0)

	// Connect to websocket server
	const ws = io({ path: '/wss' })

	// const isConnected = await new Promise<boolean>((resolve) => {
	ws.on('connect', () => {
		ws.emit('join', meetingId, (response: boolean) => {
			// resolve(response)
		})
	})
	// })

	if (false) {
		// Retrieve router RTP capabilities
		const routerRtpCapabilities = await new Promise<RtpCapabilities>((resolve) => {
			ws.emit('getRouterCapabilities', meetingId, (rtpCapabilities: RtpCapabilities) => {
				resolve(rtpCapabilities)
			})
		})

		// Load device with the router RTP capabilities
		const device = new Device()
		await device.load({ routerRtpCapabilities })

		// Create send transport
		const transportOptions = await new Promise<TransportOptions>((resolve) => {
			ws.emit('createSendTransport', meetingId, (options: any) => {
				resolve(options)
			})
		})
		const sendTransport = device.createSendTransport(transportOptions)

		// Set transport "connect" event handler.
		sendTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
			try {
				ws.emit('transport-connect', sendTransport.id, {
					dtlsParameters,
				})

				callback()
			} catch (error: any) {
				errback(error)
			}
		})

		// Set transport "produce" event handler.
		sendTransport.on('produce', async ({ kind, rtpParameters, appData }, callback, errback) => {
			try {
				const producerId = await new Promise<string>((resolve) => {
					ws.emit(
						'transport-produce',
						sendTransport.id,
						{
							kind,
							rtpParameters,
							appData,
						},
						(producerId: string) => resolve(producerId),
					)
				})

				callback({ id: producerId })
			} catch (error: any) {
				errback(error)
			}
		})

		// Set transport "producedata" event handler.
		sendTransport.on('producedata', async ({ sctpStreamParameters, label, protocol, appData }, callback, errback) => {
			try {
				const producerId = await new Promise<string>((resolve) => {
					ws.emit(
						'transport-produce',
						sendTransport.id,
						{
							sctpStreamParameters,
							label,
							protocol,
							appData,
						},
						(producerId: string) => resolve(producerId),
					)
				})

				callback({ id: producerId })
			} catch (error: any) {
				errback(error)
			}
		})

		const { stream, isVideoEnabled, isAudioEnabled } = storeToRefs(mediaStore)

		let videoProducer: Producer | undefined
		let audioProducer: Producer | undefined

		watch([stream], async () => {
			if (stream.value) {
				if (isVideoEnabled.value) {
					const videoTrack = stream.value.getVideoTracks()[0]
					console.log(videoTrack)
					videoProducer = await sendTransport.produce({ track: videoTrack })
				}
				if (isAudioEnabled.value) {
					const audioTrack = stream.value.getVideoTracks()[0]
					audioProducer = await sendTransport.produce({ track: audioTrack })
				}

				if (videoProducer && !isVideoEnabled) {
					videoProducer.close()
				}
				if (audioProducer && !isAudioEnabled) {
					audioProducer.close()
				}
			}
		})
	}
</script>

<template>
	<PodHeader />
	<div class="flex min-h-[82vh] items-center justify-center bg-zinc-800">
		<div class="grid h-[70vh] w-[80vw] grid-cols-4 grid-rows-2 gap-3">
			<!-- Local user's video feed -->
			<div class="relative overflow-hidden rounded-lg bg-zinc-900" v-if="true">
				<!-- <VideoPreview :cameraActive="video.cameraActive" /> -->
				<LocalVideo />
				<p class="absolute bottom-0 left-0 bg-black px-2 py-1.5 text-white">Local User</p>
			</div>

			<!-- External users' video feeds -->
			<div class="relative overflow-hidden rounded-lg bg-zinc-900" v-for="stream in externalStreams" :key="stream.id">
				<ExternalVideo :stream="stream.stream" />
				<p class="absolute bottom-0 left-0 bg-black px-2 py-1.5 text-white">{{ stream.id }}</p>
			</div>
		</div>
	</div>
	<BreakoutRoomModal :meetingRef="meetingId" />
	<PodFooter />
</template>

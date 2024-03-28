<script setup>
	import { useHms } from '~/composables/useHms.ts'
	import { onMounted } from 'vue'
	import { VideoCameraSlashIcon } from '@heroicons/vue/24/outline'

	const customerStore = useCustomerStore()
	const customer = customerStore.state.customer

	const {
		videoRefs,
		isLocalAudioEnabled,
		isLocalVideoEnabled,
		isConnected,
		peers,
		joinRoom,
		leaveRoom,
		toggleAudio,
		toggleVideo,
	} = getHmsInstance()

	const roomCode = 'qas-jmqz-old'
	let userName = ''

	onMounted(async () => {
		if (customer?.firstName && customer?.lastName) {
			userName = customer.firstName + ' ' + customer.lastName
			await joinRoom(roomCode, userName)
		}
	})

	window.addEventListener('beforeunload', () => {
		if (isConnected.value) {
			leaveRoom()
		}
	})
</script>

<template>
	<div class="container mx-auto mb-8 mt-8">
		<div v-if="isConnected" class="conference-section">
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				<div v-for="peer in peers" :key="peer.id" class="peer-tile relative w-full rounded-lg bg-zinc-500 sm:w-auto">
					<div class="z-[2] relative">
						<video
							ref="videoRefs"
							class="peer-video mirror-video mx-auto h-auto w-full rounded-lg"
							autoplay
							muted
							playsinline
						></video>
					</div>
					<div class="absolute left-0 top-0 z-[1] flex h-full w-full items-center justify-center rounded-md">
						<VideoCameraSlashIcon class="z-[1] h-10 w-10" />
					</div>
					<div class="peer-name z-[2] absolute bottom-2 left-2 mt-2 rounded bg-[rgb(0,0,0,0.3)] px-2 text-white">
						<p>{{ peer.name }}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style>
	.mirror-video {
		transform: scaleX(-1);
	}
</style>

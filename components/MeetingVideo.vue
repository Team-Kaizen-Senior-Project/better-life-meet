<script setup>
	import { onMounted } from 'vue'
	import { VideoCameraSlashIcon } from '@heroicons/vue/24/outline'
	const customerStore = useCustomerStore()
	const customer = customerStore.state.customer
	const PLACEHOLDER_LENGTH = 8

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

	const props = defineProps({
		roomCode: String,
	})
	const loadedPeers = ref([
		{ id: 'placeholder-0' },
		{ id: 'placeholder-1' },
		{ id: 'placeholder-2' },
		{ id: 'placeholder-3' },
		{ id: 'placeholder-4' },
		{ id: 'placeholder-5' },
		{ id: 'placeholder-6' },
		{ id: 'placeholder-7' },
	])
	let userName = ''

	onMounted(async () => {
		if (customer?.firstName && customer?.lastName) {
			userName = customer.firstName + ' ' + customer.lastName
			await joinRoom(props.roomCode, userName)
		}
	})

	window.addEventListener('beforeunload', () => {
		if (isConnected.value) {
			leaveRoom()
		}
	})
	watch(
		() => peers,
		(newPeers) => {
			if (isConnected.value) {
				const currentPeers = newPeers.value
				if (currentPeers.length > PLACEHOLDER_LENGTH) {
					loadedPeers.value = currentPeers
				} else {
					const temp = []
					for (let i = 0; i < PLACEHOLDER_LENGTH; i++) {
						if (currentPeers[i]) {
							temp[i] = currentPeers[i]
							console.log(temp[i].id)
						} else {
							temp[i] = { id: `placeholder-${i}` }
						}
					}
					loadedPeers.value = temp
				}
			}
		},
		{ immediate: true, deep: true },
	)
</script>

<template>
	<div data-testid="meeting-container" class="">
		<div class="conference-section" data-testid="conference-section">
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				<div v-for="peer in loadedPeers" :key="peer.id" class="relative w-full rounded-lg bg-zinc-500 sm:w-auto">
					<div v-if="!peer.id.includes('placeholder')">
						<div class="relative z-[2]">
							<video
								ref="videoRefs"
								class="mirror-video max-h-[10vh] min-h-[225px] min-w-full rounded-lg"
								autoplay
								muted
								playsinline
								data-testid="video"
							></video>
						</div>
						<div class="absolute left-0 top-0 z-[1] flex h-full w-full items-center justify-center rounded-md">
							<VideoCameraSlashIcon class="z-[1] h-10 w-10" />
						</div>
						<div class="peer-name absolute bottom-2 left-2 z-[2] mt-2 rounded bg-[rgb(0,0,0,0.3)] px-2 text-white">
							<p>{{ peer.name }}</p>
						</div>
					</div>
					<div
						v-else
						class="aspect-video max-h-[10vh] min-h-[225px] min-w-full rounded-lg border border-gray-600 bg-zinc-900"
					></div>
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

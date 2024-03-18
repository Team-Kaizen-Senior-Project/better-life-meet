<script setup>
import { useHms } from '~/composables/useHms.ts'
import { onMounted } from 'vue'

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
		userName = customer.firstName + " " + customer.lastName
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
	<div class="container mx-auto mt-8 mb-8">
		<div v-if="isConnected" class="conference-section">
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				<div v-for="peer in peers" :key="peer.id" class="peer-tile bg-zinc-500 rounded-lg p-4 w-full sm:w-auto">
					<video ref="videoRefs" class="peer-video w-full h-auto rounded-lg mx-auto" autoplay muted
						playsinline></video>
					<div class=" text-black peer-name mt-2 text-center font-bold">{{ peer.name }}</div>
				</div>
			</div>
		</div>
	</div>
</template>
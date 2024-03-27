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
		sendChatMessage,
	} = getHmsInstance()

	const roomCode = 'qas-jmqz-old'
	let userName = ''

	onMounted(async () => {
		if (customer?.firstName && customer?.lastName) {
			userName = customer.firstName + ' ' + customer.lastName
			await joinRoom(roomCode, userName)
			await sendChatMessage('hello')
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
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<div v-for="peer in peers" :key="peer.id" class="peer-tile w-full rounded-lg bg-zinc-500 p-4 sm:w-auto">
					<video ref="videoRefs" class="peer-video mx-auto h-auto w-full rounded-lg" autoplay muted playsinline></video>
					<div class="peer-name mt-2 text-center font-bold text-black">{{ peer.name }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

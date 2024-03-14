<template>
	<header>
		<img class="logo" src="https://www.100ms.live/assets/logo.svg" />
		<button v-if="isConnected" @click="leaveRoom" class="btn-danger">Leave Room</button>
	</header>

	<form v-if="!isConnected" @submit.prevent="joinRoom">
		<h2>Join Room</h2>
		<div class="input-container">
			<input v-model="userName" type="text" placeholder="Your name" />
		</div>
		<div class="input-container">
			<input v-model="roomCode" type="text" placeholder="Room code" />
		</div>
		<button type="submit" class="btn-primary">Join</button>
	</form>

	<div v-if="isConnected" class="conference-section">
		<h2>Conference</h2>
		<div>
			<div v-for="peer in peers" :key="peer.id" class="peer-tile">
				<video ref="videoRefs" class="peer-video" autoplay muted playsinline></video>
				<div class="peer-name">{{ peer.name }}</div>
			</div>
		</div>
	</div>

	<div v-if="isConnected" class="control-bar">
		<button @click="toggleAudio" class="btn-control">{{ isLocalAudioEnabled ? 'Mute' : 'Unmute' }}</button>
		<button @click="toggleVideo" class="btn-control">{{ isLocalVideoEnabled ? 'Hide' : 'Unhide' }}</button>
	</div>
</template>

<script setup>
	import { ref, onBeforeUnmount, onMounted, watch } from 'vue'
	import {
		HMSReactiveStore,
		selectIsLocalAudioEnabled,
		selectIsLocalVideoEnabled,
		selectPeers,
		selectIsConnectedToRoom,
		selectVideoTrackByID,
	} from '@100mslive/hms-video-store'

	const hmsManager = new HMSReactiveStore()
	hmsManager.triggerOnSubscribe()
	const hmsStore = hmsManager.getStore()
	const hmsActions = hmsManager.getActions()

	const userName = ref('')
	const roomCode = ref('')
	const videoRefs = ref([])

	const isLocalAudioEnabled = ref(false)
	const isLocalVideoEnabled = ref(false)
	const isConnected = ref(false)
	const peers = ref([])

	watch(peers, (newPeers) => {
		// synchronize the video elements with the peers
		newPeers.forEach((peer, index) => {
			hmsActions.attachVideo(peer.videoTrack, videoRefs.value[index])
		})
	})

	onBeforeUnmount(() => {
		leaveRoom()
	})

	const joinRoom = async () => {
		const authToken = await hmsActions.getAuthTokenByRoomCode({ roomCode: roomCode.value })
		await hmsActions.join({
			userName: userName.value,
			authToken,
		})
	}

	const leaveRoom = async () => {
		await hmsActions.leave()
	}

	const toggleAudio = async () => {
		isLocalAudioEnabled.value = !isLocalAudioEnabled.value
		await hmsActions.setLocalAudioEnabled(isLocalAudioEnabled.value)
	}

	const toggleVideo = async () => {
		isLocalVideoEnabled.value = !isLocalVideoEnabled.value
		await hmsActions.setLocalVideoEnabled(isLocalVideoEnabled.value)
	}

	hmsStore.subscribe((val) => (isLocalAudioEnabled.value = val), selectIsLocalAudioEnabled)
	hmsStore.subscribe((val) => (isLocalVideoEnabled.value = val), selectIsLocalVideoEnabled)
	hmsStore.subscribe((val) => (isConnected.value = val), selectIsConnectedToRoom)
	hmsStore.subscribe((val) => (peers.value = val), selectPeers)
</script>

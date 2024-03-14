<script setup>
	import { useHms } from '~/composables/useHms.ts'
	const {
		userName,
		roomCode,
		videoRefs,
		isLocalAudioEnabled,
		isLocalVideoEnabled,
		isConnected,
		peers,
		joinRoom,
		leaveRoom,
		toggleAudio,
		toggleVideo,
	} = useHms()
</script>

<template>
	<header>
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
		<div class = "grid h-[70vh] w-[80vw] grid-cols-4 grid-rows-2 gap-3">
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


<style></style>

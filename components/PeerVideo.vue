<template>
	<div class="peer-video-container">
		<video ref="videoEl" autoplay muted playsinline></video>
		<p>{{ peer.name }}</p>
	</div>
</template>

<script setup>
	import { onMounted, ref, watch } from 'vue'
	import { HMSReactiveStore } from '@100mslive/hms-video-store'

	const props = defineProps({
		peer: Object,
	})

	const videoEl = ref(null)
	const hmsManager = new HMSReactiveStore()
	const hmsActions = hmsManager.getActions()

	// Function to attach/detach video
	const updateVideoTrack = (track) => {
		if (!videoEl.value) return
		if (track && track.enabled) {
			hmsActions.attachVideo(track.id, videoEl.value)
		} else {
			videoEl.value.srcObject = null // Clear the video src if no track or disabled
		}
	}

	onMounted(() => {
		updateVideoTrack(props.peer.videoTrack)
	})

	watch(
		() => props.peer.videoTrack,
		(newTrack, oldTrack) => {
			// Detach old track if necessary
			if (oldTrack && videoEl.value) {
				hmsActions.detachVideo(oldTrack.id, videoEl.value)
			}
			updateVideoTrack(newTrack)
		},
		{ immediate: true },
	)
</script>

<style scoped>
	.peer-video-container {
		/* Your styles here */
	}
	video {
		width: 100%; /* Adjust as needed */
		height: auto; /* Adjust as needed */
	}
</style>

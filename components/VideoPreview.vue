<script setup>
	const props = defineProps({
		cameraActive: Boolean,
	})

	const videoElement = ref(null)
	const media = useMediaStore()

	watchEffect(async (onInvalidate) => {
		if (props.cameraActive) {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					video: { deviceId: media.state.videoSourceId ? { exact: media.state.videoSourceId } : undefined },
				})
				if (videoElement.value) {
					videoElement.value.srcObject = stream
				}
			} catch (error) {
				console.error('Error accessing the camera', error)
			}
		} else {
			if (videoElement.value && videoElement.value.srcObject) {
				const tracks = videoElement.value.srcObject.getTracks()
				tracks.forEach((track) => track.stop())
				videoElement.value.srcObject = null
			}
		}

		onInvalidate(() => {
			if (videoElement.value && videoElement.value.srcObject) {
				const tracks = videoElement.value.srcObject.getTracks()
				tracks.forEach((track) => track.stop())
				videoElement.value.srcObject = null
			}
		})
	})
</script>

<template>
	<video
		ref="videoElement"
		autoplay
		playsinline
		class="h-full w-full -scale-x-100 object-contain"
		@contextmenu.prevent
	></video>
</template>

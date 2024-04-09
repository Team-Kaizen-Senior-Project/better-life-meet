export const useMediaStore = defineStore('media', () => {
	const isVideoEnabled: Ref<boolean> = ref(false)
	const isAudioEnabled: Ref<boolean> = ref(false)

	const mediaStream: Ref<MediaStream | undefined> = ref(undefined)

	const update = async () => {
		mediaStream.value = await navigator.mediaDevices.getUserMedia({
			video: isVideoEnabled.value,
			audio: isAudioEnabled.value,
		})
	}

	const toggleVideo = async () => {
		console.log('inside toggle video')
		isVideoEnabled.value = !isVideoEnabled.value

		if (isVideoEnabled.value) {
			await update()
		} else {
			if (mediaStream.value) {
				mediaStream.value.getVideoTracks().forEach((track) => track.stop())
			}
		}
	}

	const toggleAudio = async () => {
		isAudioEnabled.value = !isAudioEnabled.value

		if (isAudioEnabled.value) {
			await update()
		} else {
			if (mediaStream.value) {
				mediaStream.value.getAudioTracks().forEach((track) => track.stop())
			}
		}
	}

	const stream = computed(() => mediaStream.value)

	return { stream, isVideoEnabled, isAudioEnabled, toggleAudio, toggleVideo }
})

export const useMediaStore = defineStore('media', () => {
	const isVideoEnabled: Ref<boolean> = ref(false)
	const isAudioEnabled: Ref<boolean> = ref(false)
	const audioSourceId: Ref<String | null> = ref(null);
	const videoSourceId: Ref<String | null> = ref(null);
	const outputSourceId: Ref<String | null> = ref(null);

	const mediaStream: Ref<MediaStream | undefined> = ref(undefined)

	function setAudioSourceId(id: String) {
		audioSourceId.value = id;
	}

	function setVideoSourceId(id: String) {
		videoSourceId.value = id;
	}

	function setOutputSourceId(id: String) {
		outputSourceId.value = id;
	}

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

	return {
		stream,
		isVideoEnabled,
		isAudioEnabled,
		audioSourceId,
		videoSourceId,
		outputSourceId,
		toggleAudio,
		toggleVideo,
		setAudioSourceId,
		setVideoSourceId,
		setOutputSourceId,
	}
})

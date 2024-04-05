interface State {
	isVideoEnabled: boolean,
	isAudioEnabled: boolean,
	audioSourceId: String,
	videoSourceId: String,
	outputSourceId: String,
	mediaStream: MediaStream | null,
}

export const useMediaStore = defineStore('media', () => {
	const state = reactive<State>({
		isVideoEnabled: false,
		isAudioEnabled: false,
		audioSourceId: "",
		videoSourceId: "",
		outputSourceId: "",
		mediaStream: null,

	})
	async function initDeviceSources() {
		console.log("here")
		const devices = await navigator?.mediaDevices.enumerateDevices();
		console.log("devices: ", devices)
		if (!state.audioSourceId) {
			const audioInput = devices?.find(device => device.kind === 'audioinput');
			if (audioInput) state.audioSourceId = audioInput.deviceId;
		}
		if (!state.videoSourceId) {
			const videoInput = devices?.find(device => device.kind === 'videoinput');
			if (videoInput) state.videoSourceId = videoInput.deviceId;
		}
		if (!state.outputSourceId) {
			const audioOutput = devices?.find(device => device.kind === 'audiooutput');
			if (audioOutput) state.outputSourceId = audioOutput.deviceId;
		}
	}

	function setAudioSourceId(id: String) {
		state.audioSourceId = id;
	}

	function setVideoSourceId(id: String) {
		state.videoSourceId = id;
	}

	function setOutputSourceId(id: String) {
		state.outputSourceId = id;
	}

	const update = async () => {
		state.mediaStream = await navigator.mediaDevices.getUserMedia({
			video: state.isVideoEnabled,
			audio: state.isAudioEnabled,
		})
	}

	const toggleVideo = async () => {
		console.log('inside toggle video')
		state.isVideoEnabled = !state.isVideoEnabled

		if (state.isVideoEnabled) {
			await update()
		} else {
			if (state.mediaStream) {
				state.mediaStream.getVideoTracks().forEach((track) => track.stop())
			}
		}
	}

	const toggleAudio = async () => {
		state.isAudioEnabled = !state.isAudioEnabled

		if (state.isAudioEnabled) {
			await update()
		} else {
			if (state.mediaStream) {
				state.mediaStream.getAudioTracks().forEach((track) => track.stop())
			}
		}
	}

	const stream = computed(() => state.mediaStream)

	return {
		state,
		toggleAudio,
		toggleVideo,
		setAudioSourceId,
		setVideoSourceId,
		setOutputSourceId,
		initDeviceSources,
	}

},
	{
		persist: {
			paths: ["state.isVideoEnabled", "state.audioSourceId",
				"state.isAudioEnabled", "audioSourceId", "state.videoSourceId",
				"state.outputSourceId"],
			storage: persistedState.localStorage,
		}
	}
)


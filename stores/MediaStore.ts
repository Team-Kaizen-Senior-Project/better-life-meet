interface State {
	isVideoEnabled: boolean
	isAudioEnabled: boolean
	audioSourceId: String
	videoSourceId: String
	outputSourceId: String
	modalOpen: boolean
}

export const useMediaStore = defineStore(
	'media',
	() => {
		const state = reactive<State>({
			isVideoEnabled: false,
			isAudioEnabled: false,
			audioSourceId: '',
			videoSourceId: '',
			outputSourceId: '',
			modalOpen: false,
		})
		async function initDeviceSources() {
			console.log('here')
			const devices = await navigator?.mediaDevices.enumerateDevices()
			console.log('devices: ', devices)
			if (!state.audioSourceId) {
				const audioInput = devices?.find((device) => device.kind === 'audioinput')
				if (audioInput) state.audioSourceId = audioInput.deviceId
			}
			if (!state.videoSourceId) {
				const videoInput = devices?.find((device) => device.kind === 'videoinput')
				if (videoInput) state.videoSourceId = videoInput.deviceId
			}
			if (!state.outputSourceId) {
				const audioOutput = devices?.find((device) => device.kind === 'audiooutput')
				if (audioOutput) state.outputSourceId = audioOutput.deviceId
			}
		}

		function setAudioSourceId(id: String) {
			state.audioSourceId = id
		}

		function setVideoSourceId(id: String) {
			state.videoSourceId = id
		}

		function setOutputSourceId(id: String) {
			state.outputSourceId = id
		}
		function setModalOpen(value: boolean) {
			state.modalOpen = value
		}
		function toggleModal() {
			state.modalOpen = !state.modalOpen
		}
		const toggleVideo = async () => {
			console.log('inside toggle video')
			state.isVideoEnabled = !state.isVideoEnabled
		}

		const toggleAudio = async () => {
			console.log('toggle audio')
			state.isAudioEnabled = !state.isAudioEnabled
		}

		return {
			state,
			toggleAudio,
			toggleVideo,
			setAudioSourceId,
			setVideoSourceId,
			setOutputSourceId,
			initDeviceSources,
			setModalOpen,
			toggleModal,
		}
	},
	{
		persist: {
			paths: [
				'state.isVideoEnabled',
				'state.isAudioEnabled',
				'state.audioSourceId',
				'state.videoSourceId',
				'state.outputSourceId',
			],
			storage: persistedState.localStorage,
		},
	},
)

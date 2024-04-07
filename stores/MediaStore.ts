interface State {
	isVideoEnabled: boolean
	isAudioEnabled: boolean
	audioSourceId: string
	videoSourceId: string
	outputSourceId: string
	modalOpen: boolean
	audioDevices: MediaDeviceInfo[]
	videoDevices: MediaDeviceInfo[]
	outputDevices: MediaDeviceInfo[]
	mediaDevices: MediaDeviceInfo[]
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
			audioDevices: [],
			videoDevices: [],
			outputDevices: [],
			mediaDevices: [],
		})

		async function initDeviceSources() {
			const devices = await navigator.mediaDevices.enumerateDevices()
			state.mediaDevices = devices
			await updateDeviceLists()
			if (!state.audioSourceId) {
				const audioInput = state.mediaDevices?.find((device) => device.kind === 'audioinput')
				if (audioInput) state.audioSourceId = audioInput.deviceId
			}
			if (!state.videoSourceId) {
				const videoInput = state.mediaDevices?.find((device) => device.kind === 'videoinput')
				if (videoInput) state.videoSourceId = videoInput.deviceId
			}
			if (!state.outputSourceId) {
				const audioOutput = state.mediaDevices?.find((device) => device.kind === 'audiooutput')
				if (audioOutput) state.outputSourceId = audioOutput.deviceId
			}
			if (state.isAudioEnabled === undefined) {
				state.isAudioEnabled = false
			}
			if (state.isVideoEnabled === undefined) {
				state.isVideoEnabled = false
			}
			console.log(state)
		}
		async function updateDeviceLists() {
			state.audioDevices = state.mediaDevices.filter((device) => device.kind === 'audioinput')
			state.videoDevices = state.mediaDevices.filter((device) => device.kind === 'videoinput')
			state.outputDevices = state.mediaDevices.filter((device) => device.kind === 'audiooutput')
		}

		async function setAudioSourceId(id: string) {
			state.audioSourceId = id
		}

		async function setVideoSourceId(id: string) {
			state.videoSourceId = id
		}

		async function setOutputSourceId(id: string) {
			state.outputSourceId = id
		}
		function setModalOpen(value: boolean) {
			state.modalOpen = value
		}
		function toggleModal() {
			state.modalOpen = !state.modalOpen
		}
		async function toggleVideo() {
			state.isVideoEnabled = !state.isVideoEnabled
		}

		async function toggleAudio() {
			state.isAudioEnabled = !state.isAudioEnabled
		}
		function setAudioEnabled(val: boolean) {
			state.isAudioEnabled = val
		}
		function setVideoEnabled(val: boolean) {
			state.isVideoEnabled = val
		}

		return {
			state,
			setAudioEnabled,
			setVideoEnabled,
			toggleAudio,
			toggleVideo,
			setAudioSourceId,
			setVideoSourceId,
			setOutputSourceId,
			initDeviceSources,
			updateDeviceLists,
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
				'state.videoDevices',
				'state.audioDevices',
				'state.outputDevices',
				'state.mediaDevices',
			],
			storage: persistedState.localStorage,
		},
	},
)

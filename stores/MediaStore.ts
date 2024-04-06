interface State {
	isVideoEnabled: boolean
	isAudioEnabled: boolean
	audioSourceId: string
	videoSourceId: string
	outputSourceId: string
	modalOpen: boolean,
	audioDevices: [],
	videoDevices: [],
	outputDevices: [],
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
		})
		async function initDeviceSources() {
			console.log('Initalizing Device Sources')
			const devices = await navigator?.mediaDevices.enumerateDevices()
			state.audioDevices = devices.filter((device) => device.kind === 'audioinput');
			state.videoDevices = devices.filter((device) => device.kind === 'videoinput');
			state.outputDevices = devices.filter((device) => device.kind === 'audiootput')

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
			if (state.isAudioEnabled === undefined) {
				state.isAudioEnabled = false;
			}
			if (state.isVideoEnabled === undefined) {
				state.isVideoEnabled = false;
			}
			console.log(state)
		}

		function setAudioSourceId(id: string) {
			console.log("set audio Source id")
			state.audioSourceId = id
		}

		function setVideoSourceId(id: string) {
			console.log("set video Source id")
			state.videoSourceId = id
		}

		function setOutputSourceId(id: string) {
			console.log("set output Source id")

			state.outputSourceId = id
		}
		function setModalOpen(value: boolean) {
			state.modalOpen = value
		}
		function toggleModal() {
			state.modalOpen = !state.modalOpen
		}
		async function toggleVideo() {
			console.log('toggle video')
			state.isVideoEnabled = !state.isVideoEnabled
		}

		async function toggleAudio() {
			console.log('toggle audio')
			state.isAudioEnabled = !state.isAudioEnabled
		}
		function setAudioEnabled(val: boolean) {
			console.log("inside set audio")
			state.isAudioEnabled = val
		}
		function setVideoEnabled(val: boolean) {
			console.log("inside set video")
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
				'state.outputDevices'
			],
			storage: persistedState.localStorage,
		},
	},
)

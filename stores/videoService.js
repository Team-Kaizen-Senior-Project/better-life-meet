export const useVideoStore = defineStore('video', () => {
	const cameraActive = ref(false)
	const joinedMeeting = ref(false)
	const modalOpen = ref(false)

	const toggleCamera = () => {
		cameraActive.value = !cameraActive.value
	}
	const setModalOpen = (value) => {
		modalOpen.value = value
	}
	const joinMeeting = () => {
		joinedMeeting.value = true
		modalOpen.value = !modalOpen.value
	}

	const leaveMeeting = () => {
		joinedMeeting.value = false
		modalOpen.value = false
		if (cameraActive.value) {
			toggleCamera()
		}
	}
	return { cameraActive, toggleCamera, joinedMeeting, joinMeeting, leaveMeeting, modalOpen, setModalOpen }
})

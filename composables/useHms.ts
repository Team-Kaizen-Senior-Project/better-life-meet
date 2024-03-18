import { ref, onBeforeUnmount, onMounted, watch } from 'vue'
import {
    HMSReactiveStore,
    selectIsLocalAudioEnabled,
    selectIsLocalVideoEnabled,
    selectPeers,
    selectIsConnectedToRoom,
    selectVideoTrackByID,
} from '@100mslive/hms-video-store'
import type { HmsInstance } from '~/types'

export function useHms() : HmsInstance {
	console.log("Initializing useHms instance");
	const hmsManager = new HMSReactiveStore()
	hmsManager.triggerOnSubscribe()
	const hmsStore = hmsManager.getStore()
	const hmsActions = hmsManager.getActions()

	const userName = ref('')
	const roomCode = ref('')
	const videoRefs = ref([])

	const isLocalAudioEnabled = ref(false)
	const isLocalVideoEnabled = ref(false)
	const isConnected = ref(false)
	const peers = ref([])

	watch(peers, (newPeers) => {
		// synchronize the video elements with the peers
		newPeers.forEach((peer, index) => {
			hmsActions.attachVideo(peer.videoTrack, videoRefs.value[index])
		})
	})

	onBeforeUnmount(() => {
		leaveRoom()
	})

	const joinRoom = async (roomCode: string, username: string) => {
  const authToken = await hmsActions.getAuthTokenByRoomCode({ roomCode })
  await hmsActions.join({
    userName: username,
    authToken,
  })
}

	const leaveRoom = async () => {
		await hmsActions.leave()
	}

	const toggleAudio = async () => {
		console.log('Toggling audio');
		isLocalAudioEnabled.value = !isLocalAudioEnabled.value
		await hmsActions.setLocalAudioEnabled(isLocalAudioEnabled.value)
	}

	const toggleVideo = async () => {
		console.log('Toggling video');
		isLocalVideoEnabled.value = !isLocalVideoEnabled.value
		await hmsActions.setLocalVideoEnabled(isLocalVideoEnabled.value)
	}

	hmsStore.subscribe((val) => (isLocalAudioEnabled.value = val), selectIsLocalAudioEnabled)
	hmsStore.subscribe((val) => (isLocalVideoEnabled.value = val), selectIsLocalVideoEnabled)
	hmsStore.subscribe((val) => (isConnected.value = val), selectIsConnectedToRoom)
	hmsStore.subscribe((val) => (peers.value = val), selectPeers)

    return {
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
    }
}
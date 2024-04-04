import { ref, onBeforeUnmount, onMounted, watch } from 'vue'
import {
	HMSReactiveStore,
	selectIsLocalAudioEnabled,
	selectIsLocalVideoEnabled,
	selectPeers,
	selectIsConnectedToRoom,
	selectVideoTrackByID,
	selectHMSMessages,
	selectBroadcastMessages,
	type HMSPeer,
} from '@100mslive/hms-video-store'
import type { HmsInstance, ChatMessage } from '~/types'

// this is the hms instance
// if you want to use the instance just do export const useHmsInstance and you can important it into any file.
const useHmsInstance = () => useState<null | HMSReactiveStore>('hmsReactiveStore', () => shallowRef(null))

// creates the instance
// ensures singleton-ness
export function getHmsInstance() {
	const instance = useHmsInstance()
	if (instance.value === null) {
		console.log('Creating a new instance of useHms')
		instance.value = new HMSReactiveStore()
	} else {
		console.log('Reusing existing instance of useHms')
	}
	return instance as Ref<HMSReactiveStore>
}

// this uses getHmsInstance and useHmsInstance. We generally call useHms anywhere we need HMS.
export const useHms = () => {
	const hmsManagerRef = getHmsInstance()
	const hmsManager = unref(hmsManagerRef)

	hmsManager.triggerOnSubscribe()
	const hmsStore = hmsManager.getStore()
	const hmsActions = hmsManager.getActions()

	const userName = ref('')
	const roomCode = ref('')
	const videoRefs = ref([])

	const isLocalAudioEnabled = ref(false)
	const isLocalVideoEnabled = ref(false)
	const isConnected = ref<boolean | null | undefined>(false)
	const peers = ref<HMSPeer[]>([])
	const messages: Ref<ChatMessage[]> = ref([])
	const video = useVideoStore()

	watch(peers, (newPeers) => {
		// Synchronize the video elements with the peers
		newPeers.forEach((peer, index) => {
			if (peer.videoTrack && videoRefs.value[index]) {
				try {
					hmsActions.attachVideo(peer.videoTrack, videoRefs.value[index])
				} catch (error) {
					console.error(error)
				}
			}
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
			settings: {
				isAudioMuted: true,
				isVideoMuted: !video.cameraActive,
			},
		})
	}

	const leaveRoom = async () => {
		await hmsActions.leave()
	}

	const toggleAudio = async () => {
		console.log('Toggling audio')
		isLocalAudioEnabled.value = !isLocalAudioEnabled.value
		await hmsActions.setLocalAudioEnabled(isLocalAudioEnabled.value)
	}

	const toggleVideo = async () => {
		console.log('Toggling video')
		isLocalVideoEnabled.value = !isLocalVideoEnabled.value
		await hmsActions.setLocalVideoEnabled(isLocalVideoEnabled.value)
	}

	const sendBroadcastMessage = async (message: string) => {
		try {
			const result = await hmsActions.sendBroadcastMessage(message)
			console.log('message success', result)
		} catch (error) {
			console.log('there is an error', error)
		}
	}

	hmsStore.subscribe((newMessages) => {
		if (newMessages.length > 0) {
			const mostRecentMessage = newMessages[newMessages.length - 1]
			messages.value.push({
				id: mostRecentMessage.id,
				content: mostRecentMessage.message,
				sendername: mostRecentMessage.senderName,
				time: mostRecentMessage.time
			})
		}
	}, selectHMSMessages) //for all messages, send

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
		messages,
		joinRoom,
		leaveRoom,
		toggleAudio,
		toggleVideo,
		sendBroadcastMessage,
	}
}

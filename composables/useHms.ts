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
	selectPeersWithAudioStatus,
	selectLocalMediaSettings,
	HMSLogLevel,
	selectDevices,
	selectDominantSpeaker,
	type HMSPeer,
	type HMSPeerWithMuteStatus,
	type HMSVideoTrack,
} from '@100mslive/hms-video-store'
import type { HmsInstance, ChatMessage } from '~/types'

// this is the hms instance
// if you want to use the instance just do export const useHmsInstance and you can import it into any file.
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
	hmsActions.setLogLevel(HMSLogLevel.NONE)
	const hmsNotifications = hmsManager.getNotifications()

	const userName = ref('')
	const roomCode = ref('')
	const videoRefs = ref([])

	const isConnected = ref<boolean | null | undefined>(false)
	const peers = ref<HMSPeer[]>([])
	const peersWithAudioStatus = ref<HMSPeerWithMuteStatus[]>([])
	const messages: Ref<ChatMessage[]> = ref([])
	const media = useMediaStore()
	const dominantSpeaker = ref<HMSPeer | null>(null)

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
				isAudioMuted: !media.state?.isAudioEnabled,
				isVideoMuted: !media.state?.isVideoEnabled,
			},
		})
		//set the preferences that the user selected on the dashboard
		await hmsActions.setAudioSettings({ deviceId: media.state?.audioSourceId })
		await hmsActions.setVideoSettings({ deviceId: media.state?.videoSourceId })
		await hmsActions.setAudioOutputDevice(media.state?.outputSourceId)

		hmsStore.subscribe((val) => media.setAudioEnabled(val), selectIsLocalAudioEnabled)
		hmsStore.subscribe((val) => media.setVideoEnabled(val), selectIsLocalVideoEnabled)
	}

	const leaveRoom = async () => {
		await hmsActions.leave()
	}

	const toggleAudio = async () => {
		await media.toggleAudio()
		await hmsActions.setLocalAudioEnabled(media.state.isAudioEnabled)
	}

	const toggleVideo = async () => {
		await media.toggleVideo()
		await hmsActions.setLocalVideoEnabled(media.state.isVideoEnabled)
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
				time: mostRecentMessage.time,
			})
		}
	}, selectHMSMessages) //for all messages, send

	hmsStore.subscribe((val) => (isConnected.value = val), selectIsConnectedToRoom)
	hmsStore.subscribe((val) => (peers.value = val), selectPeers)
	hmsStore.subscribe((val) => (peersWithAudioStatus.value = val), selectPeersWithAudioStatus)

	hmsStore.subscribe((val) => {
		dominantSpeaker.value = val
	}, selectDominantSpeaker)

	return {
		userName,
		roomCode,
		videoRefs,
		isConnected,
		peers,
		peersWithAudioStatus,
		messages,
		hmsNotifications,
		joinRoom,
		leaveRoom,
		toggleAudio,
		toggleVideo,
		sendBroadcastMessage,
		selectLocalMediaSettings,
		selectDevices,
		hmsStore,
		hmsActions,
		dominantSpeaker,
	}
}

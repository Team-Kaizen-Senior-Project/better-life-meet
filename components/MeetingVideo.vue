<script setup>
	import { onMounted } from 'vue'
	import { VideoCameraSlashIcon, MicrophoneIcon } from '@heroicons/vue/24/outline'

	const customerStore = useCustomerStore()
	const customer = customerStore.state.customer
	const {
		videoRefs,
		isLocalAudioEnabled,
		isLocalVideoEnabled,
		isConnected,
		peers,
		joinRoom,
		leaveRoom,
		toggleAudio,
		toggleVideo,
		dominantSpeaker,
		peersWithAudioStatus,
	} = useHms()

	const props = defineProps({
		roomCode: String,
	})

	let userName = ''

	function handleBeforeUnload(event) {
		event.preventDefault()
		event.returnValue = 'Are you sure you want to leave the meeting?'
	}

	onMounted(async () => {
		if (!isConnected.value && customer?.firstName && customer?.lastName) {
			userName = customer.firstName + ' ' + customer.lastName
			await joinRoom(props.roomCode, userName)
		}
		window.addEventListener('beforeunload', handleBeforeUnload)
	})

	onUnmounted(() => {
		if (isConnected.value) {
			leaveRoom()
			window.removeEventListener('beforeunload', handleBeforeUnload)
		}
	})
</script>

<template>
	<div class="container mx-auto mb-8 mt-8" data-testid="meeting-container">
		<div v-if="isConnected" class="conference-section" data-testid="conference-section">
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				<div
					v-for="peerWithAudioStatus in peersWithAudioStatus"
					:key="peerWithAudioStatus.peer.id"
					:class="{
						'dominant-speaker': dominantSpeaker && peerWithAudioStatus.peer.id === dominantSpeaker.id,
						'relative w-full rounded-lg bg-zinc-600 sm:w-auto': true,
					}"
				>
					<div class="relative z-[2]">
						<video
							ref="videoRefs"
							class="peer-video mirror-video mx-auto h-auto w-full rounded-lg"
							autoplay
							muted
							playsinline
							data-testid="video"
						></video>
					</div>
					<div class="absolute left-0 top-0 z-[1] flex h-full w-full items-center justify-center rounded-md">
						<VideoCameraSlashIcon class="z-[1] h-10 w-10" />
					</div>
					<div
						class="peer-name absolute bottom-2 left-2 z-[2] mt-2 flex items-center rounded bg-[rgb(0,0,0,0.3)] px-2 text-white"
					>
						<p>{{ peerWithAudioStatus.peer.name }}</p>
						<MicrophoneIcon v-if="peerWithAudioStatus.isAudioEnabled" class="ml-2 h-4 w-4 text-green-500" />
						<svg
							v-else
							class="ml-2 h-4 w-4 text-red-500"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							strokeWidth="{1.5}"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path strokeLinecap="round" strokeLinejoin="round" d="M19 19L17.591 17.591L5.409 5.409L4 4" />
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 18.75C13.5913 18.75 15.1174 18.1179 16.2426 16.9926C17.3679 15.8674 18 14.3413 18 12.75V11.25M12 18.75C10.4087 18.75 8.88258 18.1179 7.75736 16.9926C6.63214 15.8674 6 14.3413 6 12.75V11.25M12 18.75V22.5M8.25 22.5H15.75M12 15.75C11.2044 15.75 10.4413 15.4339 9.87868 14.8713C9.31607 14.3087 9 13.5456 9 12.75V4.5C9 3.70435 9.31607 2.94129 9.87868 2.37868C10.4413 1.81607 11.2044 1.5 12 1.5C12.7956 1.5 13.5587 1.81607 14.1213 2.37868C14.6839 2.94129 15 3.70435 15 4.5V12.75C15 13.5456 14.6839 14.3087 14.1213 14.8713C13.5587 15.4339 12.7956 15.75 12 15.75Z"
							/>
						</svg>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style>
	.mirror-video {
		transform: scaleX(-1);
	}

	.dominant-speaker {
		box-shadow: 0 0 0 3px limegreen;
	}
</style>

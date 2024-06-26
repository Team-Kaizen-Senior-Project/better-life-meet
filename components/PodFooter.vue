<script setup>
	import { MicrophoneIcon, VideoCameraIcon, VideoCameraSlashIcon } from '@heroicons/vue/24/outline'
	import ParticipantIcons from './ParticipantIcons.vue'
	import { HMSNotificationTypes } from '@100mslive/hms-video-store'
	const media = useMediaStore()
	const chatbox = useChatboxStore()
	const { isConnected, toggleAudio, toggleVideo, hmsNotifications } = useHms()

	const isChatBoxVisible = computed(() => chatbox.isChatBoxVisible)
	const newMessageCount = ref(0)
	watch(
		() => chatbox.isChatBoxVisible,
		(newVal) => {
			if (!newVal) {
				// If chatbox becomes not visible (closed)
				newMessageCount.value = 0 // Reset the notification counter
			}
		},
	)
	const unsubscribe = hmsNotifications.onNotification((notification) => {
		if (notification.type === HMSNotificationTypes.NEW_MESSAGE) {
			newMessageCount.value++ // Increment the notification count
			// console.log(`${notification.data.message} received from ${notification.data.senderName}`)
		}
	})
	onBeforeUnmount(() => {
		unsubscribe()
	})
</script>

<template>
	<footer class="w-full bg-black py-4">
		<inner-column>
			<div class="mx-auto flex items-center justify-between">
				<div class="flex gap-2">
					<div class="relative flex gap-2">
						<Button class="rounded px-5 py-3" @click.stop="toggleAudio">
							<MicrophoneIcon v-if="media.state.isAudioEnabled" class="h-5 w-5 text-green-500" />
							<svg
								v-else
								class="h-5 w-5 text-red-500"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								strokeWidth="{1.5}"
								viewBox="0 0 24 24"
								stroke="currentColor"
								className="w-6 h-6"
							>
								<path strokeLinecap="round" strokeLinejoin="round" d="M19 19L17.591 17.591L5.409 5.409L4 4" />
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M12 18.75C13.5913 18.75 15.1174 18.1179 16.2426 16.9926C17.3679 15.8674 18 14.3413 18 12.75V11.25M12 18.75C10.4087 18.75 8.88258 18.1179 7.75736 16.9926C6.63214 15.8674 6 14.3413 6 12.75V11.25M12 18.75V22.5M8.25 22.5H15.75M12 15.75C11.2044 15.75 10.4413 15.4339 9.87868 14.8713C9.31607 14.3087 9 13.5456 9 12.75V4.5C9 3.70435 9.31607 2.94129 9.87868 2.37868C10.4413 1.81607 11.2044 1.5 12 1.5C12.7956 1.5 13.5587 1.81607 14.1213 2.37868C14.6839 2.94129 15 3.70435 15 4.5V12.75C15 13.5456 14.6839 14.3087 14.1213 14.8713C13.5587 15.4339 12.7956 15.75 12 15.75Z"
								/>
							</svg>
						</Button>
						<AudioSettingsPopover />
					</div>
					<div class="relative flex gap-2">
						<Button class="rounded px-5 py-3" @click.stop="toggleVideo">
							<VideoCameraIcon v-if="media.state.isVideoEnabled" class="h-5 w-5 text-green-500" />
							<VideoCameraSlashIcon v-else class="h-5 w-5 text-red-500" />
						</Button>
						<VideoSettingsPopover />
					</div>
					<div class="hidden sm:block">
						<AudioOutputPopover />
					</div>
				</div>
				<div class="hidden sm:block">
					<ParticipantIcons />
				</div>
				<div class="flex flex-row gap-2">
					<Button
						v-if="isConnected"
						class="toggle-chat relative flex items-center justify-center rounded px-5 py-3"
						@click="chatbox.toggleChatBox"
					>
						<div
							v-if="newMessageCount > 0 && !isChatBoxVisible"
							class="absolute right-0 top-0 h-5 w-5 -translate-y-1/2 translate-x-1/2 transform rounded-full border-2 border-white bg-red-500"
						>
							{{ newMessageCount }}
						</div>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth="{1.5}"
							stroke="currentColor"
							class="h-5 w-5"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
							/>
						</svg>
					</Button>
					<LeaveMeetingModal />
				</div>
			</div>
		</inner-column>
	</footer>
</template>

<style scoped></style>

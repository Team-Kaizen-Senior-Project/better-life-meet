<script setup>
	import { MicrophoneIcon, VideoCameraIcon, VideoCameraSlashIcon } from '@heroicons/vue/24/outline'

	const media = useMediaStore()
	const chatbox = useChatboxStore()
	const { isLocalAudioEnabled, isLocalVideoEnabled, isConnected, toggleAudio, toggleVideo } = getHmsInstance()
</script>

<template>
	<footer class="absolute bottom-0 w-full bg-black py-4">
		<inner-column>
			<div class="mx-auto flex items-center justify-between">
				<div class="flex gap-2">
					<Button class="rounded px-5 py-3" @click="toggleAudio">
						<MicrophoneIcon v-if="isLocalAudioEnabled" class="h-5 w-5 text-green-500" />
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
					<Button class="rounded px-5 py-3" @click="toggleVideo">
						<VideoCameraIcon v-if="isLocalVideoEnabled" class="h-5 w-5 text-green-500" />
						<VideoCameraSlashIcon v-else class="h-5 w-5 text-red-500" />
					</Button>
					<!-- <Button class="rounded px-5 py-3">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="h-5 w-5"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
							/>
						</svg>
					</Button> -->
				</div>
				<div class="flex -space-x-3 overflow-hidden">
					<button class="inline-block aspect-[1/1] h-8 w-8 rounded-full border-[3px] border-white bg-gray-100">
						U
					</button>
					<button class="inline-block aspect-[1/1] h-8 w-8 rounded-full border-[3px] border-white bg-gray-200">
						U
					</button>
					<button class="inline-block aspect-[1/1] h-8 w-8 rounded-full border-[3px] border-white bg-gray-300">
						U
					</button>
					<button class="inline-block aspect-[1/1] h-8 w-8 rounded-full border-[3px] border-white bg-gray-400">
						U
					</button>
					<button class="inline-block aspect-[1/1] h-8 w-8 rounded-full border-[3px] border-white bg-gray-500">
						U
					</button>
				</div>
				<div class="flex flex-row gap-2">
					<Button v-if="isConnected" class="rounded px-5 py-3" @click="chatbox.toggleChatBox">
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

<script setup>
import { MicrophoneIcon } from '@heroicons/vue/24/outline'
import { VideoCameraIcon } from '@heroicons/vue/24/outline'

const media = useMediaStore()
const chatbox = useChatboxStore();


</script>

<template>
	<footer class="absolute bottom-0 w-full bg-black py-4">
		<inner-column>
			<div class="mx-auto flex items-center justify-between">
				<div class="flex gap-2">
					<Button class="rounded px-5 py-3" @click="media.toggleAudio">
						<MicrophoneIcon class="h-5 w-5" />
					</Button>
					<Button class="rounded px-5 py-3" @click="media.toggleVideo">
						<VideoCameraIcon class="h-5 w-5" />
					</Button>
					<Button class="rounded px-5 py-3">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
							stroke="currentColor" class="h-5 w-5">
							<path stroke-linecap="round" stroke-linejoin="round"
								d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
						</svg>
					</Button>
				</div>
				<div class="flex -space-x-3 overflow-hidden">
					<button
						class="inline-block aspect-[1/1] h-8 w-8 rounded-full border-[3px] border-white bg-gray-100">
						U
					</button>
					<button
						class="inline-block aspect-[1/1] h-8 w-8 rounded-full border-[3px] border-white bg-gray-200">
						U
					</button>
					<button
						class="inline-block aspect-[1/1] h-8 w-8 rounded-full border-[3px] border-white bg-gray-300">
						U
					</button>
					<button
						class="inline-block aspect-[1/1] h-8 w-8 rounded-full border-[3px] border-white bg-gray-400">
						U
					</button>
					<button
						class="inline-block aspect-[1/1] h-8 w-8 rounded-full border-[3px] border-white bg-gray-500">
						U
					</button>
				</div>
				<div class="flex flex-row gap-2">
					<Button class="rounded px-5 py-3" @click="chatbox.toggleChatBox">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
							stroke="currentColor" class="w-6 h-6">
							<path stroke-linecap="round" stroke-linejoin="round"
								d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
						</svg>
					</Button>
					<LeaveMeetingModal />
				</div>
			</div>
		</inner-column>
	</footer>
</template>

<style scoped></style>

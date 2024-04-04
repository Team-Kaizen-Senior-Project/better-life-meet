<script setup lang="ts">
	import { ref, computed } from 'vue'
	import { useRoute } from 'vue-router'
	import type { ChatMessage } from '~/types'

	const { messages, sendBroadcastMessage } = getHmsInstance()

	const chatbox = useChatboxStore()
	const customerStore = useCustomerStore()
	const route = useRoute()
	const meetingId = route.params.id

	// toggle state of chatbox to false when pressing X icon of Meeting chat bar
	function closeChatBox() {
		chatbox.toggleChatBox()
	}
	const isChatBoxVisible = computed(() => chatbox.isChatBoxVisible)

	const customer = customerStore.state.customer
	const currentUser = `${customer?.firstName} ${customer?.lastName}`
	const newMessage = ref('')
	const meetingID = route.params.id
	console.log(meetingID)

	const sendMessage = () => {
		if (newMessage.value.trim() !== '') {
			sendBroadcastMessage(newMessage.value.trim())
			newMessage.value = '' // Clear input after sending
		}
	}
</script>

<template>
	<div
		v-if="isChatBoxVisible"
		class="flex h-[78vh] w-[20vw] flex-col overflow-hidden rounded-lg bg-zinc-600 p-4 px-4 drop-shadow-xl"
	>
		<div class="mb-4 flex items-center justify-between rounded-md bg-zinc-700 p-2">
			<h1 class="text-white">Meeting Chat</h1>
			<button @click="closeChatBox" class="ml-2">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="h-8">
					<path
						fill-rule="evenodd"
						d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		</div>
		<div class="mb-4 flex flex-1 flex-col overflow-y-auto">
			<!-- Dynamically display messages -->
			<div v-for="message in messages" :key="message.id" style="padding: 5px">
				<div v-if="message.sendername == currentUser" class="flex justify-end">
					<div class="flex-direction column">
						<div class="text-xs text-white ">
							<b>{{ message.sendername }}</b>&nbsp;&nbsp;{{ message.time.toLocaleTimeString('en-US', {hour12: true, hour:'numeric', minute: 'numeric'})}}
						</div>
						<div
							class="max-w-xs rounded-lg bg-sky-500 px-3 py-1 text-white"
							style="border-radius: 15px; padding-top: 10px; word-wrap: break-word; overflow-wrap: break-word;"
						>
							<div style="font-weight: 490">{{ message.content }}</div>
						</div>
					</div>
				</div>
				<div v-else-if="message.sendername != currentUser" class="flex justify-start" style="margin-right: 50px;">
					<div class="flex-direction column">
						<div class="text-xs text-white">
							<b>{{ message.sendername }}</b>&nbsp;&nbsp;{{ message.time.toLocaleTimeString('en-US', {hour12: true, hour:'numeric', minute: 'numeric'})}}
                        </div>
						<div
							class="max-w-xs rounded-lg bg-gray-500 px-3 py-1 text-white"
							style="border-radius: 15px; padding-top: 10px; word-wrap: break-word; overflow-wrap: break-word;"
						>
							<div style="font-weight: 490">{{ message.content }}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="flex flex-row">
			<input
				v-model="newMessage"
				@keyup.enter="sendMessage"
				placeholder="Type a message..."
				class="form-input mr-1 mt-auto flex-1 rounded-md border px-4 py-2"
			/>
			<button @click="sendMessage" class="h-10 rounded-full">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="h-6 w-6">
					<path
						d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z"
					/>
				</svg>
			</button>
		</div>
	</div>
</template>

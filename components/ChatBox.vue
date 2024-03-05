<script setup lang="ts">
	import { ref, computed } from 'vue'
	import { io } from 'socket.io-client'
	import { useRoute } from 'vue-router'
	import type { Meeting } from '~/types'
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
	const ws = io()
	const messages = ref([])
	const newMessage = ref('')
	const meetingID = route.params.id
	console.log(meetingID)

	ws.on('connect', () => {
		const roomId = meetingID
		const user = `${customer?.firstName} ${customer?.lastName}`
		ws.emit('joinChat', { roomId, customer: user })
		ws.on('message', (chat) => {
			const isCurrentUser = chat.author === `${customer?.firstName} ${customer?.lastName}`
			messages.value.push({ ...chat, isCurrentUser })
		})
	})

	function sendMessage() {
		if (newMessage.value.trim() !== '') {
			const chatMessage = {
				author: `${customer?.firstName} ${customer?.lastName}`,
				text: newMessage.value,
				isCurrentUser: true, // This message is from the current user
			}

			ws.emit('chatMessage', { roomId: meetingID, chat: chatMessage })
			messages.value.push(chatMessage)
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
          <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clip-rule="evenodd" />
        </svg>
      </button>
		</div>
		<div class="mb-4 flex flex-1 flex-col overflow-y-auto">
			<!-- Dynamically display messages -->
			<div v-for="(msg, index) in messages" :key="index" class="mb-4">
				<div v-if="msg.isCurrentUser" class="flex justify-end">
					<div class="max-w-xs rounded-lg bg-sky-500 px-4 py-2 text-white">
						<div class="text-xs text-white">{{ msg.author }}</div>
						{{ msg.text }}
					</div>
				</div>
				<div v-else class="flex">
					<div class="max-w-xs rounded-lg bg-gray-300 px-4 py-2">
						<div class="text-gray-500 text-xs">{{ msg.author }}</div>
						{{ msg.text }}
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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="w-6 h-6">
          <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
        </svg>

      </button>

		</div>
	</div>
</template>

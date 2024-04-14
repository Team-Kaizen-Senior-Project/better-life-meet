<script setup lang="ts">
	import { ref, computed } from 'vue'
	import { useRoute } from 'vue-router'
	import { useHms } from '~/composables/useHms'
	import type { ChatMessage } from '~/types'
	import { Button } from '~/components/ui/button'
	const { messages, sendBroadcastMessage } = useHms()

	const chatbox = useChatboxStore()
	const customerStore = useCustomerStore()
	const route = useRoute()
	const meetingId = route.params.id
	const textArea: Ref<HTMLTextAreaElement | null> = ref(null)

	function autoResize() {
		if (textArea.value) {
			console.log('Resizing textarea...')

			textArea.value.style.height = 'auto'
			if (textArea.value.scrollHeight < 100) {
				// Set  max height condition
				textArea.value.style.height = `${textArea.value.scrollHeight}px`
			} else {
				textArea.value.style.height = '100px' // Set the max height if content is too large
				textArea.value.style.overflowY = 'auto' // Enable scroll when max height is reached
			}
		}
	}

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
			autoResize()
		}
	}
</script>

<template>
	<div v-if="isChatBoxVisible" class="chat flex h-full flex-col overflow-hidden rounded-lg bg-zinc-700 drop-shadow-xl">
		<div class="flex items-center justify-between border-b border-zinc-600 bg-zinc-700 px-4 py-3">
			<h1 class="font-bold text-white">Meeting Chat</h1>
			<button @click="closeChatBox" class="ml-2">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="h-6">
					<path
						fill-rule="evenodd"
						d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		</div>
		<div class="mb-4 flex flex-1 flex-col overflow-y-auto p-4 px-4">
			<!-- Dynamically display messages -->
			<div v-for="message in messages" :key="message.id">
				<div v-if="message.sendername == currentUser" class="mb-3 flex justify-end pr-2">
					<div class="flex-direction column">
						<div class="flex justify-end text-xs text-white">
							<span class="mb-1 font-medium">{{ message.sendername }}</span>
							<span class="ml-2">
								{{ message.time.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric' }) }}
							</span>
						</div>
						<div
							class="max-w-[250px] rounded-2xl bg-sky-600 px-4 py-2 font-medium text-white"
							style="word-wrap: break-word; overflow-wrap: break-word"
						>
							<div class="w-fit">{{ message.content }}</div>
						</div>
					</div>
				</div>
				<div v-else-if="message.sendername != currentUser" class="mb-3 flex justify-start pl-2">
					<div class="flex-direction column">
						<div class="flex text-xs text-white">
							<span class="mb-1 font-medium">{{ message.sendername }}</span>
							<span class="ml-2">
								{{ message.time.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric' }) }}
							</span>
						</div>
						<div class="max-w-[250px] rounded-2xl bg-gray-300 px-4 py-2 font-medium text-black">
							<div class="w-fit">{{ message.content }}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="flex flex-row items-center justify-center gap-2 border-t border-zinc-600 px-4 py-3">
			<textarea
				ref="textArea"
				@input="autoResize"
				v-model="newMessage"
				@keyup.enter="sendMessage"
				placeholder="Type a message..."
				class="form-input mr-1 mt-auto w-full flex-1 resize-none rounded-md border border-zinc-700 bg-zinc-600 px-4 py-2 text-white placeholder-zinc-400"
			/>
			<Button
				@click="sendMessage"
				variant="default"
				size="sm"
				class="max-w-fit self-end bg-sky-600 text-white hover:bg-sky-700"
			>
				chat
			</Button>
		</div>
	</div>
</template>

<style scoped>
	.chat {
		scrollbar-width: thin;
		scrollbar-color: #a1a1aa transparent;
	}
</style>

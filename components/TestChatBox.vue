<script setup lang="ts">
	import { ref, computed } from 'vue'
	import { useRoute } from 'vue-router'
	import { useHms } from '~/composables/useHms'
	import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../components/ui/resizable'
	import type { ChatMessage } from '~/types'

	const { messages, sendBroadcastMessage } = useHms()

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
	<div class="hidden md:block"></div>
</template>

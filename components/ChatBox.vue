<script setup lang="ts">
import { ref, computed } from 'vue';
import { io } from 'socket.io-client';
import { useRoute } from 'vue-router';
import type { Meeting } from '~/types'
const chatbox = useChatboxStore();
const customerStore = useCustomerStore();
const route = useRoute();
const meetingId = route.params.id;


// toggle state of chatbox to false when pressing X icon of Meeting chat bar
function closeChatBox() {
  chatbox.toggleChatBox();
}
const isChatBoxVisible = computed(() => chatbox.isChatBoxVisible);

const ws = io();
const messages = ref([]);
const newMessage = ref('');
const meetingID = route.params.id;
console.log(meetingID);

ws.on('connect', () => {
  const roomId = meetingID;
  const customerEmail = customerStore.state.customer.email;
  ws.emit('joinChat', { roomId, customer: customerEmail });
  ws.on('message', (chat) => {
    const isCurrentUser = chat.author === customerStore.state.customer.firstName;
    messages.value.push({ ...chat, isCurrentUser });
  });
});

function sendMessage() {
  if (newMessage.value.trim() !== "") {
    const chatMessage = {
      author: customerStore.state.customer.firstName,
      text: newMessage.value,
      isCurrentUser: true, // This message is from the current user
    };

    ws.emit('chatMessage', { roomId: meetingID, chat: chatMessage });
    messages.value.push(chatMessage);
    newMessage.value = ''; // Clear input after sending
  }
}


</script>

<template>
  <div v-if="isChatBoxVisible"
    class="flex flex-col rounded-lg h-[78vh] w-[20vw] drop-shadow-xl bg-zinc-600 p-4 overflow-hidden px-4">
    <div class="flex justify-between items-center bg-zinc-700 p-2 rounded-md mb-4">
      <h1 class="text-white">Meeting Chat</h1>
      <button @click="closeChatBox" class="ml-2">
        X
      </button>
    </div>
    <div class="flex flex-1 flex-col overflow-y-auto mb-4">
      <!-- Dynamically display messages -->
      <div v-for="(msg, index) in messages" :key="index" class="p-2 rounded-lg mb-2"
        :class="{ 'bg-blue-200': msg.isCurrentUser, 'bg-gray-200': !msg.isCurrentUser }">
        <strong>{{ msg.author }}</strong> {{ msg.text }}
      </div>
    </div>
    <div class="flex flex-row">
      <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message..."
        class="form-input mt-auto px-4 py-2 border rounded-md mr-1 flex-1" />
    </div>
  </div>
</template>

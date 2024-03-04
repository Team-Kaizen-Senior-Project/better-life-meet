export const useChatboxStore = defineStore('chatbox', {
    state: () => ({
      isChatBoxVisible: false,
    }),
    actions: {
      toggleChatBox() {
        this.isChatBoxVisible = !this.isChatBoxVisible;
        console.log("Chatbox visibility:",this.isChatBoxVisible)
      },
    },
  });
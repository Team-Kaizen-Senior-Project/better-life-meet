export const useLeaveModalStore = defineStore('leaveMeetingModal', {
    state: () => ({
      isLeaveModalOpen: false,
    }),
    actions: {
      toggleLeaveModal() {
        this.isLeaveModalOpen = !this.isLeaveModalOpen
        console.log('Leave Meeting Modal visibility:', this.isLeaveModalOpen)
      },
    },
  })
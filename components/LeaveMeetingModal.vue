<script setup lang="ts">
import { useHms } from '~/composables/useHms'
const { isConnected } = useHms()

const leaveMeetingModal = useLeaveModalStore()
const isLeaveModalOpen = computed(() => leaveMeetingModal.isLeaveModalOpen)
const { leaveRoom } = useHms()
const customModal = {
	overlay: {
		background: 'bg-zinc-900/90 dark:bg-gray-800/75',
	},
}

async function confirmLeave() {
	try {
		await leaveRoom()
		await navigateTo('/dashboard')
		leaveMeetingModal.toggleLeaveModal()
	} catch (error) {
		console.log(error)
	}
}
</script>

<template>
	<Button v-if="isConnected" class="rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-700"
		@click="leaveMeetingModal.toggleLeaveModal()" data-testid="leave-button">
		Leave
	</Button>
	<UModal v-model="isLeaveModalOpen" class="w-[90vw] max-w-[450px]" :ui="customModal" data-testid="leave-modal">
		<div class="relative rounded bg-white p-4 shadow-lg">
			<div class="text-center">
				<p class="text-lg font-semibold">Are you sure you want to leave the meeting?</p>
			</div>
			<div class="mt-4 flex justify-center gap-4">
				<UButton type="button" variant="ghost" color="gray" @click="leaveMeetingModal.toggleLeaveModal()"
					data-testid="cancel-button">
					Cancel
				</UButton>
				<UButton type="button" color="red" @click="confirmLeave">Yes, leave meeting</UButton>
			</div>
		</div>
	</UModal>
</template>

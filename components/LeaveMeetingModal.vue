<script setup lang="ts">
	import { useHms } from '~/composables/useHms'
	const { isConnected } = useHms()

	const leaveMeetingModal = useLeaveModalStore()
	const isLeaveModalOpen = computed(() => leaveMeetingModal.isLeaveModalOpen)
	const { leaveRoom } = useHms()
	const customModal = {
		overlay: {
			background: 'bg-zinc-800/90',
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
	<Button
		v-if="isConnected"
		class="rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-700"
		@click="leaveMeetingModal.toggleLeaveModal()"
		data-testid="leave-button"
	>
		Leave
	</Button>
	<UModal v-model="isLeaveModalOpen" class="max-w-[400px]" :ui="customModal" data-testid="leave-modal">
		<div class="relative rounded-lg border border-zinc-900 bg-zinc-900 p-4">
			<div class="text-center">
				<p class="mb-2 text-lg font-semibold text-white">Are you sure you want to leave the meeting?</p>
				<p class="text-sm text-zinc-200">
					Your attendance will be logged. We track this data too ensure each pod accountability meeting is successful
				</p>
			</div>
			<div class="mt-4 flex justify-center gap-4">
				<UButton
					type="button"
					variant="outline"
					color="gray"
					@click="leaveMeetingModal.toggleLeaveModal()"
					data-testid="cancel-button"
					class="hover:bg-zinc-700"
				>
					Cancel
				</UButton>
				<UButton type="button" color="red" @click="confirmLeave">Yes, leave meeting</UButton>
			</div>
		</div>
	</UModal>
</template>

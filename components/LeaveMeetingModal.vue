<script setup lang="ts">
	const isLeaveModalOpen = ref(false)
	const attendee = useAttendeeStore()

	const customModal = {
		overlay: {
			background: 'bg-zinc-900/90 dark:bg-gray-800/75'
		},
	}

	async function confirmLeave() {
		// Close the modal
		isLeaveModalOpen.value = false
		try {
			await attendee.logLeaveTime()
			await navigateTo('/dashboard')
		} catch (error) {
			console.log(error)
		}
	}
</script>

<template>
	<Button
		class="rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-700"
		@click="isLeaveModalOpen = true"
	>
		Leave
	</Button>
	<UModal v-model="isLeaveModalOpen" class="w-[90vw] max-w-[450px]" :ui="customModal">
		<div class="relative rounded bg-white p-4 shadow-lg">
			<div class="text-center">
				<p class="text-lg font-semibold">Are you sure you want to leave the meeting?</p>
			</div>
			<div class="mt-4 flex justify-center gap-4">
				<UButton type="button" variant="ghost" color="gray" @click="isLeaveModalOpen = false">Cancel</UButton>
				<UButton type="button" color="red" @click="confirmLeave">Yes, leave meeting</UButton>
			</div>
		</div>
	</UModal>
</template>
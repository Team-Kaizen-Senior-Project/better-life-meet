<script setup lang="ts">
import type { AttendeeFields } from '~/types'

const media = useMediaStore()
const attendee = useAttendeeStore()
const { state: customerState } = useCustomerStore()
const props = defineProps({
	meetingRef: String,
})
const customModal = ref({
	overlay: {
		background: 'bg-zinc-900/90',
	},
})
function joinMeeting() {
	media.setModalOpen(false)
}

const handleCancel = async () => {
	try {
		await navigateTo('/dashboard')
	} catch (error) {
		console.log(error)
	}
}


</script>
<template>
	<UModal v-model="media.state.modalOpen" class="max-w-[400px]" :ui="customModal" data-testid="settings-modal">
		<VideoSettings title="Pod accountability meeting is starting"
			description="This is your chance to make sure your camera is setup and your microphone is working!"
			:boxLength="50">
			<template #join>
				<!-- TODO add functionality to cancel joining a meeting -->
				<Button type="button" class="mr-2 rounded-md bg-gray-500 font-medium text-white hover:bg-sky-600"
					data-testid="br-cancel-button" @click="handleCancel">
					Cancel
				</Button>
				<Button type="button" @click="joinMeeting"
					class="rounded-md bg-sky-500 font-medium text-white hover:bg-sky-600">
					Join
				</Button>
			</template>
		</VideoSettings>
	</UModal>
</template>

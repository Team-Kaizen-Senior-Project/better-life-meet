<script setup lang="ts">
	import type { AttendeeFields } from '~/types'

	const video = useVideoStore()
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
	async function createNewAttendee() {
/* 		const startTime = new Date().toISOString()
		const { meetingRef } = props
		const isCameraOn = video.cameraActive

		const fields: AttendeeFields = {
			joinTime: startTime,
			leaveTime: startTime,
			customerRef: customerState.customer?.id,
			usedVideo: isCameraOn,
			meetingRef,
			// TODO: use actual user device
			platform: 'Mobile',
		} */

		try {
			//console.log(fields)
			//await attendee.createAttendee(fields)
			video.joinMeeting()
		} catch (error) {
			console.log('error creating attendee', error)
		}
	}
</script>
<template>
	<UModal v-model="video.modalOpen" class="max-w-[400px]" :ui="customModal">
		<VideoSettings
			title="Pod accountability meeting is starting"
			description="This is your chance to make sure your camera is setup and your microphone is working!"
			:boxLength="50"
		>
			<template #join>
				<!-- TODO add functionality to cancel joining a meeting -->
				<Button type="button" class="mr-2 rounded-md bg-gray-500 font-medium text-white hover:bg-sky-600">
					Cancel
				</Button>
				<Button
					type="button"
					@click="createNewAttendee"
					class="rounded-md bg-sky-500 font-medium text-white hover:bg-sky-600"
				>
					Join
				</Button>
			</template>
		</VideoSettings>
	</UModal>
</template>

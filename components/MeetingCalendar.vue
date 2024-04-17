<script setup lang="ts">
	import type {} from '@samk-dev/nuxt-vcalendar'
	import type { Meeting } from '~/types'
	const props = defineProps({
		meetings: Array as PropType<Meeting[]>,
	})
	const date = ref(new Date())
	const attrs = ref<any>([
		{
			key: 'today',
			highlight: {
				color: 'green',
				fillMode: 'solid',
			},
			dates: new Date(),
		},
	])
	watch(
		() => props.meetings,
		(newMeetings) => {
			if (!newMeetings) return
			newMeetings.forEach((meeting) => {
				const startTime = new Date(meeting.startTime.isoString).toLocaleTimeString([], { timeStyle: 'short' })
				const endTime = new Date(meeting.endTime.isoString).toLocaleTimeString([], { timeStyle: 'short' })
				attrs.value.push({
					key: 'meeting',
					dot: {
						color: 'green',
					},
					dates: new Date(meeting.startTime.isoString),
					popover: {
						label: `Accountability Meeting ${startTime} - ${endTime}`,
					},
				})
			})
		},
		{
			immediate: true,
		},
	)
</script>
<template>
	<div class="my-calendar">
		<VCalendar v-model="date" :attributes="attrs" class="" isDark />
	</div>
</template>

<style scoped>
	.my-calendar :deep(.vc-dark) {
		--vc-bg: #27272a;
	}
	.my-calendar :deep(.vc-bordered) {
		border-color: transparent;
	}
</style>

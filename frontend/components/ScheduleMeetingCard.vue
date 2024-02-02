<script setup lang="ts">
	import { CalendarIcon } from '@heroicons/vue/24/solid'
	// TODO: Placeholder content: replace after user login integration
	const tempAttendees = ['380615136598032449', '380615136598033473', '380615136598034497', '380615136598035521']

	const isOpen = ref(false)
	const meetingStore = useScheduleMeetingStore()
	const timeZones = [
		'Eastern Time',
		'Central Time',
		'Mountain Time',
		'Pacific Time',
		'Alaska Time',
		'Hawaii-Aleutian Time',
	]
	async function scheduleMeeting(e: Event) {
		e.preventDefault()
		const form = e.target as HTMLFormElement
		if (!form.checkValidity()) return
		const startTime = new Date(`${meetingStore.startTimeData.date} ${meetingStore.startTimeData.time}`)
		const endTime = new Date(`${meetingStore.endTimeData.date} ${meetingStore.endTimeData.time}`)
		try {
			createMeeting(startTime, endTime, tempAttendees)
			isOpen.value = false
			form.reset()
		} catch (error) {
			console.error(error)
		}
	}
	const customModal = ref({
		overlay: {
			background: 'bg-zinc-900/90 dark:bg-gray-800/75',
		},
	})
</script>
<template>
	<UButton @click="isOpen = true" class="bg-sky-500 hover:bg-sky-600">
		Schedule Meeting
		<CalendarIcon class="h-5 w-5" />
	</UButton>
	<UModal v-model="isOpen" class="w-[90vw] max-w-[450px]" :ui="customModal">
		<div class="rounded bg-zinc-800 p-4 shadow-lg">
			<div>
				<p class="text-lg font-semibold text-white">Schedule New Meeting</p>
				<p class="text-gray-200">Schedule your weekly accountability meeting</p>
			</div>
			<form @submit="scheduleMeeting" class="mt-4 grid gap-4">
				<div class="grid gap-1">
					<label for="start-time-input" class="text-sm text-sm font-medium text-white">
						Start
						<span class="text-red-400">*</span>
					</label>
					<div class="flex gap-2">
						<input
							required
							v-model="meetingStore.startTimeData.date"
							id="start-time-input"
							type="date"
							class="min-w-0 flex-auto appearance-none rounded-md border border-zinc-700 border-zinc-900/10 bg-zinc-700 px-3 py-[calc(theme(spacing.2)-1px)] text-zinc-200 shadow-md shadow-zinc-800/5 placeholder:text-zinc-500 focus:border-teal-400 focus:outline-none focus:ring-4 focus:ring-teal-400/10 sm:text-sm"
						/>
						<input
							required
							v-model="meetingStore.startTimeData.time"
							type="time"
							class="min-w-0 flex-auto appearance-none rounded-md border border-zinc-700 border-zinc-900/10 bg-zinc-700 px-3 py-[calc(theme(spacing.2)-1px)] text-zinc-200 shadow-md shadow-zinc-800/5 placeholder:text-zinc-500 focus:border-teal-400 focus:outline-none focus:ring-4 focus:ring-teal-400/10 sm:text-sm"
						/>
					</div>
				</div>
				<div class="grid gap-1">
					<label for="end-time-input" class="text-sm font-medium text-white">
						End
						<span class="text-red-400">*</span>
					</label>
					<div class="flex gap-2">
						<input
							required
							v-model="meetingStore.endTimeData.date"
							id="end-time-input"
							type="date"
							class="min-w-0 flex-auto appearance-none rounded-md border border-zinc-700 border-zinc-900/10 bg-zinc-700 px-3 py-[calc(theme(spacing.2)-1px)] text-zinc-200 shadow-md shadow-zinc-800/5 placeholder:text-zinc-500 focus:border-teal-400 focus:outline-none focus:ring-4 focus:ring-teal-400/10 sm:text-sm"
						/>
						<input
							required
							v-model="meetingStore.endTimeData.time"
							type="time"
							class="min-w-0 flex-auto appearance-none rounded-md border border-zinc-700 border-zinc-900/10 bg-zinc-700 px-3 py-[calc(theme(spacing.2)-1px)] text-zinc-200 shadow-md shadow-zinc-800/5 placeholder:text-zinc-500 focus:border-teal-400 focus:outline-none focus:ring-4 focus:ring-teal-400/10 sm:text-sm"
						/>
					</div>
				</div>
				<div class="grid gap-1">
					<label for="meeting-timezone-input" class="text-sm font-medium text-white">
						Time Zone
						<span class="text-red-400">*</span>
					</label>

					<select
						required
						v-model="meetingStore.meetingTimeZone"
						name="meeting-timezone-input"
						id="meeting-timezone-input"
						class="min-w-0 flex-auto rounded-md border border-zinc-700 border-zinc-900/10 bg-zinc-700 px-3 py-[calc(theme(spacing.2)-1px)] pr-10 text-zinc-200 shadow-md shadow-zinc-800/5 placeholder:text-zinc-500 focus:border-teal-400 focus:outline-none focus:ring-4 focus:ring-teal-400/10 sm:text-sm"
					>
						<option v-for="timezone in timeZones" :value="timezone">
							{{ timezone }}
						</option>
					</select>
				</div>
				<div class="flex items-center gap-1">
					<input id="record-check" type="checkbox" />
					<label for="record-check" class="text-md font-medium text-white">
						Include prerecorded videos for the week?
					</label>
				</div>
				<div class="mt-4 flex justify-between">
					<button
						type="button"
						@click="isOpen = false"
						class="inline-flex flex-none items-center justify-center gap-2 rounded-md bg-zinc-700 px-3 py-2 text-sm font-semibold text-zinc-100 outline-offset-2 transition hover:bg-zinc-600 active:bg-zinc-700 active:text-zinc-100/70 active:transition-none"
					>
						Cancel
					</button>
					<button class="rounded-lg bg-sky-500 px-3 py-2 font-medium text-white hover:bg-sky-600">Schedule</button>
				</div>
			</form>
		</div>
	</UModal>
</template>

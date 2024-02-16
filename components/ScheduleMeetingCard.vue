<script setup lang="ts">
	import { CalendarIcon } from '@heroicons/vue/24/solid'
	import type { MeetingFields } from '~/types'

	const { createMeeting } = useApi()
	const { state: podState } = usePodStore()

	interface State {
		form: {
			startData: { date?: string; time?: string }
			endData: { date?: string; time?: string }
			timeZone?: string
		}
		isLoading: boolean
	}

	const state: State = reactive({
		form: {
			startData: {},
			endData: {},
			timeZone: 'Eastern Time',
		},
		isLoading: false,
	})

	const isOpen = ref(false)

	const startISO = computed(() => new Date(`${state.form.startData.date} ${state.form.startData.time}`).toISOString())
	const endISO = computed(() => new Date(`${state.form.endData.date} ${state.form.endData.time}`).toISOString())

	const timeZones = [
		'Eastern Time',
		'Central Time',
		'Mountain Time',
		'Pacific Time',
		'Alaska Time',
		'Hawaii-Aleutian Time',
	]

	const reset = () => {
		state.form = {
			startData: {},
			endData: {},
			timeZone: 'Eastern Time',
		}
	}

	async function scheduleMeeting(e: Event) {
		e.preventDefault()
		const form = e.target as HTMLFormElement
		if (!form.checkValidity()) return

		const meetingStartTime = new Date(startISO.value)
		const meetingEndTime = new Date(endISO.value)
		const currentTime = new Date()

		// Check if meeting start time is in the past
		if (meetingStartTime < currentTime) {
			alert('Cannot schedule a meeting in the past. Please select a future time.')
			return
		}
		// Check if meeting end time is after start time
		if (meetingEndTime <= meetingStartTime) {
			alert('Meeting end time must be after the start time. Please select a valid end time.')
			return
		}
		state.isLoading = true
		try {
			await createMeeting({
				startTime: startISO.value,
				endTime: endISO.value,
				timeZone: state.form.timeZone,
				podRef: podState.pod?.id,
			})
			isOpen.value = false
			form.reset()
			reset()
		} catch (error) {
			console.error(error)
		} finally {
			state.isLoading = false
		}
	}

	const customModal = {
		overlay: {
			background: 'bg-zinc-900/90 dark:bg-gray-800/75',
		},
	}
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
							v-model="state.form.startData.date"
							id="start-time-input"
							type="date"
							class="min-w-0 flex-auto appearance-none rounded-md border border-zinc-700 border-zinc-900/10 bg-zinc-700 px-3 py-[calc(theme(spacing.2)-1px)] text-zinc-200 shadow-md shadow-zinc-800/5 placeholder:text-zinc-500 focus:border-teal-400 focus:outline-none focus:ring-4 focus:ring-teal-400/10 sm:text-sm"
						/>
						<input
							required
							v-model="state.form.startData.time"
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
							v-model="state.form.endData.date"
							id="end-time-input"
							type="date"
							class="min-w-0 flex-auto appearance-none rounded-md border border-zinc-700 border-zinc-900/10 bg-zinc-700 px-3 py-[calc(theme(spacing.2)-1px)] text-zinc-200 shadow-md shadow-zinc-800/5 placeholder:text-zinc-500 focus:border-teal-400 focus:outline-none focus:ring-4 focus:ring-teal-400/10 sm:text-sm"
						/>
						<input
							required
							v-model="state.form.endData.time"
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
						v-model="state.form.timeZone"
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
				<div class="mt-4 flex flex-row-reverse gap-3">
					<UButton type="submit" :loading="state.isLoading">Schedule</UButton>
					<UButton variant="ghost" color="gray" type="button" @click="isOpen = false">Cancel</UButton>
				</div>
			</form>
		</div>
	</UModal>
</template>

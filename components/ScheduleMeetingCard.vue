<script setup>
  import { CalendarIcon } from '@heroicons/vue/24/solid'
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
  async function scheduleMeeting(e) {
    e.preventDefault()
    const form = e.target
    if (!form.checkValidity()) return
    const startTime = new Date(
      `${meetingStore.startTimeData.date} ${meetingStore.startTimeData.time}`,
    )
    const endTime = new Date(
      `${meetingStore.endTimeData.date} ${meetingStore.endTimeData.time}`,
    )
    const resp = await $fetch('/api/meeting', {
      method: 'POST',
      body: JSON.stringify({
        meetingId: meetingStore.generateMeetingId(),
        startTime: startTime,
        endTime: endTime,
        // TODO: get customerRefs from DB
        customerRefs: ['1243257081'],
      }),
    })
    console.log(resp)
    isOpen.value = false
  }
</script>
<template>
  <UButton @click="isOpen = true" class="bg-blue-500 hover:bg-blue-600">
    Schedule Meeting
    <CalendarIcon class="h-5 w-5" />
  </UButton>
  <UModal v-model="isOpen" class="w-[90vw] max-w-[450px]">
    <div class="rounded p-4 shadow-lg">
      <div>
        <p class="text-lg font-semibold">Schedule New Meeting</p>
        <p class="text-gray-600">Schedule your weekly accountability meeting</p>
      </div>
      <form @submit="scheduleMeeting" class="flex flex-col gap-1">
        <div class="flex flex-col gap-1">
          <label for="start-time-input" class="font-medium">
            Start
            <span class="text-red-400">*</span>
          </label>
          <div class="flex gap-2">
            <input
              required
              v-model="meetingStore.startTimeData.date"
              id="start-time-input"
              type="date"
              class="w-[70%] rounded-lg border border-gray-300 px-2 py-2"
            />
            <input
              required
              v-model="meetingStore.startTimeData.time"
              type="time"
              class="rounded-lg border border-gray-300 px-2 py-2"
            />
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <label for="end-time-input" class="font-medium">
            End
            <span class="text-red-400">*</span>
          </label>
          <div class="flex gap-2">
            <input
              required
              v-model="meetingStore.endTimeData.date"
              id="end-time-input"
              type="date"
              class="w-[70%] rounded-lg border border-gray-300 px-2 py-2"
            />
            <input
              required
              v-model="meetingStore.endTimeData.time"
              type="time"
              class="rounded-lg border border-gray-300 px-2 py-2"
            />
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <label for="meeting-timezone-input" class="font-medium">
            Time Zone
            <span class="text-red-400">*</span>
          </label>
          <select
            required
            v-model="meetingStore.meetingTimeZone"
            name="meeting-timezone-input"
            id="meeting-timezone-input"
            class="rounded-lg border border-gray-300 px-2 py-2"
          >
            <option v-for="timezone in timeZones" :value="timezone">
              {{ timezone }}
            </option>
          </select>
        </div>
        <div class="flex items-center gap-1">
          <input id="record-check" type="checkbox" />
          <label for="record-check" class="font-medium">
            Include prerecorded videos for the week?
          </label>
        </div>
        <div class="mt-4 flex justify-between">
          <button
            type="button"
            @click="isOpen = false"
            class="rounded-lg border border-gray-300 px-3 py-2 font-bold text-gray-600"
          >
            Cancel
          </button>
          <button class="rounded-lg bg-blue-500 px-3 py-2 text-white">
            Schedule
          </button>
        </div>
      </form>
    </div>
  </UModal>
</template>

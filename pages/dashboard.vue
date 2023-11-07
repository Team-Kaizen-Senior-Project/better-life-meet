<template>
    <div class="bg-zinc-800 min-h-screen flex">

        <div class="w-1/4 p-4">
        </div>

        <div class="w-1/2 p-4 grid grid-cols-2 gap-3 items-center auto-rows-min">
            <div v-for="meeting in meetings" :key="meeting.title" class="flex justify-center">
                <MeetingCard
                    :meeting="meeting"
                    :isLive="meeting.isLive"
                />
            </div>
        </div>

        <div class="w-1/4 p-4">
        </div>

    </div>
</template>


<script setup>
import MeetingCard from '@/components/MeetingCard.vue'
const meetings = [
  { title: 'Week 16 Accountability Meeting', date: 'Wednesday October 4th', time: '4:00pm', link: '#link1', isLive: true},
  { title: 'Week 17 Accountability Meeting', date: 'Wednesday October 11th', time: '4:00pm', link: '#link2', isLive: false },
  { title: 'Week 18 Accountability Meeting', date: 'Friday, October 20th', time: '2:00pm', link: '#link3', isLive: false},
  { title: 'Week 19 Accountability Meeting', date: 'Thursday October 26th', time: '3:00 PM', link: '#link4', isLive: false }
]
</script>

<style>

</style>

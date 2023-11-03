<template>
  <div class="max-w-[25rem] border border-dashed p-3" :class="borderClass">
    <div class="flex flex-col gap-1">
      <div class="text-white text-lg font-medium font-['Inter'] leading-loose">{{ meeting.title }}</div>
      <div class="text-zinc-300 text-m font-normal font-['Inter'] leading-[20px]">{{ meeting.date }}</div>
      <div class="text-zinc-300 text-m font-normal font-['Inter'] leading-[30px]">{{ meeting.time }}</div>
    </div>
    <div class="w-full flex justify-between items-center">
      <div></div> <!-- Spacer -->
      <a :href="meeting.link" class="h-8 px-3 py-2 rounded-md shadow flex gap-2 text-white text-sm font-medium font-['Inter'] leading-tight" :class="buttonClass">Join</a>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  meeting: Object,
  isLive: Boolean
})

const borderClass = computed(() => (props.isLive ? 'border-emerald-600' : 'border-white'))
const buttonClass = computed(() => (props.isLive ? 'bg-blue-500 hover:bg-blue-600' : 'bg-zinc-700'))
</script>

<script setup>
  import { MicrophoneIcon } from '@heroicons/vue/24/outline'
  import { VideoCameraIcon } from '@heroicons/vue/24/outline'
</script>
<template>
  <footer class="bg-black py-4">
    <div
      class="mx-auto flex w-[90vw] max-w-[1600px] items-center justify-between"
    >
      <div class="flex gap-2">
        <button class="rounded bg-gray-200 px-5 py-3">
          <MicrophoneIcon class="h-5 w-5" />
        </button>
        <button class="rounded bg-gray-200 px-5 py-3">
          <VideoCameraIcon class="h-5 w-5" />
        </button>
        <button class="rounded bg-gray-200 px-5 py-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-5 w-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
            />
          </svg>
        </button>
      </div>
      <div class="grid grid-cols-[repeat(5,minmax(0,19px))]">
        <button class="aspect-square h-8 rounded-full bg-gray-100">U</button>
        <button class="aspect-square h-8 rounded-full bg-gray-200">U</button>
        <button class="aspect-square h-8 rounded-full bg-gray-300">U</button>
        <button class="aspect-square h-8 rounded-full bg-gray-400">U</button>
        <button class="aspect-square h-8 rounded-full bg-gray-500">U</button>
      </div>
      <div>
        <button class="rounded bg-red-500 p-3 text-white hover:bg-red-600">
          Leave
        </button>
      </div>
    </div>
  </footer>
</template>

<style scoped></style>

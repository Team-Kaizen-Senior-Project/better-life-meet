<script setup></script>
<template>
  <header class="bg-black py-4">
    <div
      class="w-[90vw] max-w-[1600px] items-center mx-auto flex justify-between"
    >
      <nav class="mast-head">
        <!-- TODO: add in logo svg -->
        <NuxtLink href="/" class="flex gap-2">
          <span class="font-semibold text-2xl text-blue-400">Tribe</span>
          <span class="text-blue-400 text-2xl">Meet</span>
        </NuxtLink>
      </nav>
      <div class="flex gap-2 items-center">
        <button class="bg-white aspect-square text-lg h-[2.5rem] rounded-full">
          U
        </button>
        <div class="flex flex-col text-white">
          <p>User</p>
          <p>user@gmail.com</p>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped></style>

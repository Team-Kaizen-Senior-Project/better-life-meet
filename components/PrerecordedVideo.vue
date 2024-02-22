<script setup lang="ts">
	import { defineEmits } from 'vue'
	const emit = defineEmits(['toggleVideo'])
</script>

<template>
	<!-- Close video on end -->
	<video
		@ended="emit('toggleVideo')"
		playsinline="true"
		controls="true"
		src="/assets/a.mp4"
		class="mx-auto mt-4 max-h-[80vh] w-full rounded-lg bg-zinc-900 lg:w-[90%]"
	></video>
</template>

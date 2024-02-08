<script setup>
	import { ref } from 'vue'
	import { VideoCameraSlashIcon } from '@heroicons/vue/24/outline' // Import the icon

	const props = defineProps({
		stream: Object, // The external video stream
	})

	const videoElement = ref(null)
</script>

<template>
	<div class="relative aspect-video h-72 w-full rounded bg-zinc-950 text-white">
		<video
			ref="videoElement"
			v-if="props.stream"
			autoplay
			playsinline
			class="h-full w-full object-contain"
			@contextmenu.prevent
		></video>
		<div v-else class="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 transform">
			<VideoCameraSlashIcon />
			<!-- Display this icon when there is no stream -->
		</div>
	</div>
</template>

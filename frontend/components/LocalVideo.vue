<template>
	<div class="relative aspect-video h-72 w-full rounded bg-zinc-950 text-white">
		<video
			:srcObject="mediaStore.stream"
			v-if="mediaStore.isVideoEnabled"
			autoplay
			playsinline
			class="h-full w-full object-contain"
			@contextmenu.prevent
			disablePictureInPicture="true"
		></video>
		<div v-else class="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 transform">
			<!-- Display this icon when there is no stream -->
			<VideoCameraSlashIcon />
		</div>
	</div>
</template>

<script setup lang="ts">
	import { VideoCameraSlashIcon } from '@heroicons/vue/24/outline' // Import the icon

	const videoElement: Ref<HTMLVideoElement | null> = ref(null)
	const mediaStore = useMediaStore()
</script>

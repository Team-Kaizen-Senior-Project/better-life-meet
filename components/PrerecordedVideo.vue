<script setup lang="ts">
	import { ref } from 'vue'

	const videoRef = ref(null)

	const { getVimeoVideo } = useApi()

	const vimeoId = 523363936

	const { data: video, refresh, pending } = await useAsyncData('vimeo-video', () => getVimeoVideo(vimeoId))

	console.log(video.value)
	const videoUrl = computed(() => {
		return video.value.download[0].link
	})

	const emit = defineEmits(['toggleVideo'])
</script>

<template>
	<div>
		<video
			ref="videoRef"
			@ended="emit('toggleVideo')"
			controls
			contextmenu="disabled"
			autplay
			playsinline="true"
			:src="videoUrl"
			:width="video.width"
			:height="video.height"
			class="mx-auto w-full rounded-lg bg-zinc-900"
		></video>
	</div>
</template>

<script setup lang="ts">
	import { ref } from 'vue'

	const props = defineProps({
		vimeoId: {
			type: String,
			required: true,
		},
	})

	const { getVimeoVideo } = useApi()

	const { data: video, refresh, pending } = await useAsyncData<any>('vimeo-video', () => getVimeoVideo(props.vimeoId))

	const videoUrl = computed(() => {
		return video.value.download[0].link
	})

	const emit = defineEmits(['toggleVideo'])
</script>

<template>
	<div>
		<video
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

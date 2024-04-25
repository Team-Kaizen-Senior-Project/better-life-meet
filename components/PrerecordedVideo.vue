<script setup lang="ts">
	const props = withDefaults(
		defineProps<{
			video?: any
			startAt?: number
		}>(),
		{
			startAt: 0,
		},
	)
	const videoUrl = computed(() => {
		if (!props.video) return undefined
		return `${props.video.download[1].link}#t=${props.startAt}`
	})
	const emit = defineEmits(['toggleVideo'])
</script>
<template>
	<div class="mx-auto max-w-[1000px] py-2">
		<video
			v-if="video"
			@ended="emit('toggleVideo')"
			controls
			contextmenu="disabled"
			autoplay
			playsinline="true"
			:src="videoUrl"
			:width="video.width"
			:height="video.height"
			class="max-h-[500px] w-full rounded-lg bg-zinc-900"
		></video>
	</div>
</template>

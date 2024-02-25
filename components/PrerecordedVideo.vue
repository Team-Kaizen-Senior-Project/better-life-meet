<script setup lang="ts">
	import { ref } from 'vue'

	const videoRef = ref(null)

	const emit = defineEmits(['toggleVideo'])
</script>

<template>
	<div>
		<video
			ref="videoRef"
			@ended="emit('toggleVideo')"
			controls
			contextmenu="disabled"
			playsinline="true"
			src="/assets/a.mp4"
			class="mx-auto max-h-[80vh] w-full rounded-lg bg-zinc-900 lg:w-[90%]"
		></video>
	</div>
</template>

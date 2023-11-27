<script setup>
	definePageMeta({
		layout: 'meeting',
	})

	const video = useVideoStore()
</script>

<template>
	<PodHeader />
	<div class="flex min-h-[82vh] items-center justify-center bg-zinc-800">
		<div class="grid h-[70vh] w-[80vw] grid-cols-4 grid-rows-2 gap-3">
			<!-- TODO: refactor with actual video outputs -->
			<div class="relative overflow-hidden rounded-lg bg-zinc-900">
				<!-- FOR DEMO PURPOSES -->
				<VideoPreview
					:cameraActive="video.cameraActive"
					v-if="video.cameraActive && video.joinedMeeting && !video.modalOpen"
				/>
				<p class="absolute bottom-0 left-0 bg-black px-2 py-1.5 text-white">Matt</p>
			</div>
			<div class="relative overflow-hidden rounded-lg bg-zinc-900">
				<p class="absolute bottom-0 left-0 bg-black px-2 py-1.5 text-white">Brandon</p>
			</div>
			<div class="relative overflow-hidden rounded-lg bg-zinc-900">
				<p class="absolute bottom-0 left-0 bg-black px-2 py-1.5 text-white">Victor</p>
			</div>
			<div class="relative overflow-hidden rounded-lg bg-zinc-900">
				<p class="absolute bottom-0 left-0 bg-black px-2 py-1.5 text-white">Fabian</p>
			</div>
			<div class="relative overflow-hidden rounded-lg bg-zinc-900">
				<p class="absolute bottom-0 left-0 bg-black px-2 py-1.5 text-white">Sparsh</p>
			</div>
			<div class="relative overflow-hidden rounded-lg bg-zinc-900">
				<p class="absolute bottom-0 left-0 bg-black px-2 py-1.5 text-white">Jasjot</p>
			</div>
			<div class="relative overflow-hidden rounded-lg bg-zinc-900">
				<p class="absolute bottom-0 left-0 bg-black px-2 py-1.5 text-white">Brian</p>
			</div>
			<div class="relative overflow-hidden rounded-lg bg-zinc-900">
				<p class="absolute bottom-0 left-0 bg-black px-2 py-1.5 text-white">Daryl</p>
			</div>
		</div>
	</div>
	<BreakoutRoomModal />

	<PodFooter />
</template>

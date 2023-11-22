<script setup>
	definePageMeta({
		layout: false,
	})
</script>

<template>
	<main class="h-[100vh] bg-zinc-800">
		<PodHeader />
		<div class="flex min-h-[82vh] items-center justify-center">
			<div class="grid h-[70vh] w-[80vw] grid-cols-4 grid-rows-2 gap-3">
				<!-- TODO: refactor with actual video outputs -->
				<div class="relative border border-dashed bg-zinc-700">
					<!-- FOR DEMO PURPOSES -->
					<video id="demo-video-element" class="h-full w-full"></video>
					<p class="absolute bottom-0 left-0 bg-black px-2 py-1.5 text-white">Matt</p>
				</div>
				<div class="relative border border-dashed bg-zinc-700">
					<p class="absolute bottom-0 left-0 bg-black px-2 py-1.5 text-white">Brandon</p>
				</div>
				<div class="relative border border-dashed bg-zinc-700">
					<p class="absolute bottom-0 left-0 bg-black px-2 py-1.5 text-white">Victor</p>
				</div>
				<div class="relative border border-dashed bg-zinc-700">
					<p class="absolute bottom-0 left-0 bg-black px-2 py-1.5 text-white">Fabian</p>
				</div>
				<div class="relative border border-dashed bg-zinc-700">
					<p class="absolute bottom-0 left-0 bg-black px-2 py-1.5 text-white">Sparsh</p>
				</div>
				<div class="relative border border-dashed bg-zinc-700">
					<p class="absolute bottom-0 left-0 bg-black px-2 py-1.5 text-white">Jasjot</p>
				</div>
				<div class="relative border border-dashed bg-zinc-700">
					<p class="absolute bottom-0 left-0 bg-black px-2 py-1.5 text-white">Brian</p>
				</div>
				<div class="relative border border-dashed bg-zinc-700">
					<p class="absolute bottom-0 left-0 bg-black px-2 py-1.5 text-white">Daryl</p>
				</div>
			</div>
		</div>
		<BreakoutRoomModal />
		<PodFooter />
	</main>
</template>

<script setup>
	import { ref } from 'vue'
	import { Cog6ToothIcon, VideoCameraSlashIcon, VideoCameraIcon } from '@heroicons/vue/24/outline'
	import { MicrophoneIcon } from '@heroicons/vue/24/solid'

	const cameraActive = ref(false)

	const toggleCamera = () => {
		cameraActive.value = !cameraActive.value
	}
</script>

<template>
	<div class="self-start rounded-lg bg-zinc-900 p-4">
		<h2 class="mb-4 text-lg font-medium text-white">Video Settings</h2>
		<div class="relative mb-5 aspect-video h-72 w-full rounded bg-gray-800 text-white md:col-span-8">
			<VideoPreview :cameraActive="cameraActive" v-if="cameraActive" />

			<div v-else class="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 transform">
				<VideoCameraSlashIcon @click="toggleCamera" />
			</div>
		</div>
		<div class="">
			<MicControls />
		</div>
		<div class="mt-4 flex gap-2">
			<Button type="primary">
				<div class="h-4 w-4">
					<Cog6ToothIcon />
				</div>
			</Button>
			<Button type="primary" @click="toggleCamera" v-if="!cameraActive" class="relative border border-transparent">
				<div
					class="h-4 w-4 after:absolute after:left-1/2 after:top-1/2 after:h-12 after:w-[2px] after:-translate-x-1/2 after:-translate-y-1/2 after:rotate-45 after:rounded-xl after:bg-red-500 after:shadow-2xl"
				>
					<VideoCameraIcon />
				</div>
			</Button>
			<Button v-else @click="toggleCamera" type="primary" class="border border-green-500">
				<div class="h-4 w-4"><VideoCameraIcon /></div>
			</Button>
			<Button type="primary">
				<div class="h-4 w-4"><MicrophoneIcon /></div>
			</Button>
		</div>
	</div>
</template>

<style scoped>
	.slider-vertical {
		-webkit-appearance: slider-vertical;
		width: 10px;
		height: 300px;
		padding: 0 5px;
	}

	.slider-vertical::-webkit-slider-thumb {
		-webkit-appearance: none;
		border: 1px solid #000000;
		height: 20px;
		width: 20px;
		background: #4caf50;
		cursor: pointer;
	}

	.slider-vertical::-moz-range-thumb {
		width: 20px;
		height: 20px;
		background: #4caf50;
		cursor: pointer;
	}

	.slider-vertical::-ms-thumb {
		width: 20px;
		height: 10px;
		background: #4caf50;
		cursor: pointer;
	}

	.level-container {
		display: flex;
		flex-direction: column;
		height: 300px; /* Adjust as needed */
		justify-content: space-between;
	}

	.level-bar {
		background-color: #444;
		width: 20px;
		height: 10%;
		margin-bottom: 2px;
		border-radius: 10px; /* This creates the rounded corners */
	}

	.level-bar.active {
		background-color: #4caf50;
		border-radius: 10px; /* Ensure the active state also has rounded corners */
	}
</style>

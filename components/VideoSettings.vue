<script setup>
	import { Cog6ToothIcon } from '@heroicons/vue/24/outline'
	import { VideoCameraSlashIcon } from '@heroicons/vue/24/outline'
	import { MicrophoneIcon } from '@heroicons/vue/24/solid'
</script>
<template>
	<div class="border border-dashed border-zinc-500 bg-zinc-800 p-4">
		<h2 class="mb-4 text-lg font-medium text-white">Video Settings</h2>
		<div class="">
			<div class="mb-5 aspect-video h-72 w-full rounded bg-gray-800 text-white md:col-span-8">
				<div class="h-4 w-4"><VideoCameraSlashIcon /></div>
			</div>
			<div class="grid gap-2">
				<div class="grid gap-2 self-start">
					<label class="text-white">Mic level</label>
					<div class="flex items-center gap-2">
						<Button type="primary" class="w-fit"><div>test mic</div></Button>
						<div class="flex items-center gap-1">
							<div v-for="i in 55" :key="`level-bar-${i}`" class="h-4 w-1 rounded-sm bg-neutral-500"></div>
						</div>
					</div>
				</div>

				<div class="grid max-w-sm gap-2 self-start">
					<label class="whitespace-nowrap text-white">Mic volume</label>
					<input type="range" min="0" max="100" class="hover:cursor-pointer" />
				</div>
			</div>
		</div>
		<div class="justify-left mt-4 flex space-x-2">
			<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css" />
			<Button type="primary">
				<div class="h-4 w-4">
					<Cog6ToothIcon />
				</div>
			</Button>
			<Button type="primary" disabled>
				<div class="h-4 w-4"><VideoCameraSlashIcon /></div>
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

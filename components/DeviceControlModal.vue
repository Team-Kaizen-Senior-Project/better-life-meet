<script setup>
import { Cog6ToothIcon } from '@heroicons/vue/24/outline'

const isOpen = ref(false)
let audioDevices = ref([])
let videoDevices = ref([])
let audioOutput = ref([])
let selectedVideoDeviceId = ref()
let selectedAudioDeviceId = ref()
let selectedOutputDeviceId = ref()
const media = useMediaStore()
const customModal = {
	overlay: {
		background: 'bg-zinc-900/90 dark:bg-gray-800/75',
	},
}
async function getDevices() {
	const devices = await navigator.mediaDevices.enumerateDevices()
	audioDevices = devices.filter((device) => device.kind === 'audioinput')
	videoDevices = devices.filter((device) => device.kind === 'videoinput')
	audioOutput = devices.filter((device) => device.kind === 'audiooutput')
	if (videoDevices.length > 0) {
		selectedVideoDeviceId = videoDevices[0].deviceId
	}
	if (audioDevices.length > 0) {
		selectedAudioDeviceId = audioDevices[0].deviceId
	}
	if (audioOutput.length > 0) {
		selectedOutputDeviceId = audioOutput[0].deviceId
	}
	console.log(devices)
}
onMounted(() => {
	getDevices()
})
</script>
<template>
	<UButton @click="isOpen = true" class="bg-zinc-600 hover:bg-zinc-700">
		<Cog6ToothIcon class="h-4 w-4" />
	</UButton>
	<UModal v-model="isOpen" class="w-[90vw] max-w-[450px]" :ui="customModal">
		<div class="rounded bg-zinc-800 p-4 shadow-lg">
			<div class="mb-10 flex flex-col gap-3 text-white">
				<span>Video Source</span>
				<select v-model="selectedVideoDeviceId" class="rounded-lg bg-zinc-700 p-2">
					<option v-for="device in videoDevices" :value="device.deviceId" :key="device.deviceId">
						{{ device.label }}
					</option>
				</select>
				<span>Audio Source</span>
				<select v-model="selectedAudioDeviceId" class="rounded-lg bg-zinc-700 p-2">
					<option v-for="device in audioDevices" :value="device.deviceId" :key="device.deviceId">
						{{ device.label }}
					</option>
				</select>
				<span>Audio Output</span>
				<select v-model="selectedOutputDeviceId" class="rounded-lg bg-zinc-700 p-2">
					<option v-for="device in audioOutput" :value="device.deviceId" :key="device.deviceId">
						{{ device.label }}
					</option>
				</select>
			</div>
			<Button class="float-right bg-sky-500 p-2 hover:bg-sky-600">Save</Button>
			<UButton variant="ghost" color="gray" type="button" @click="isOpen = false">Cancel</UButton>

		</div>
	</UModal>
</template>

<script setup>
import { Cog6ToothIcon } from '@heroicons/vue/24/outline'

const isOpen = ref(false)
const media = useMediaStore()
console.log("inside device Control")
let audioDevices = ref([])
let videoDevices = ref([])
let audioOutput = ref([])
let selectedVideoDeviceId = ref()
let selectedAudioDeviceId = ref()
let selectedOutputDeviceId = ref()
const { hmsActions, selectLocalMediaSettings } = useHms()
const customModal = {
	overlay: {
		background: 'bg-zinc-900/90 dark:bg-gray-800/75',
	},
}
async function getDevices() {
	const devices = await navigator.mediaDevices.enumerateDevices()
	// console.log(devices)
	audioDevices.value = devices.filter((device) => device.kind === 'audioinput')
	videoDevices.value = devices.filter((device) => device.kind === 'videoinput')
	audioOutput.value = devices.filter((device) => device.kind === 'audiooutput')

	selectedVideoDeviceId.value = media.state?.videoSourceId || videoDevices.value[0]?.deviceId
	selectedAudioDeviceId.value = media.state?.audioSourceId || audioDevices.value[0]?.deviceId
	selectedOutputDeviceId.value = media.state?.outputSourceId || audioOutput.value[0]?.deviceId
	console.log(media.state);
}
onMounted(() => {
	getDevices()
})

function saveSelections() {
	media.setVideoSourceId(selectedVideoDeviceId.value)
	media.setAudioSourceId(selectedAudioDeviceId.value)
	media.setOutputSourceId(selectedOutputDeviceId.value)


	isOpen.value = false
}
</script>
<template>
	<UButton @click="isOpen = true" class="bg-zinc-600 hover:bg-zinc-700">
		<Cog6ToothIcon class="h-4 w-4" />
	</UButton>
	<UModal v-model="isOpen" class="w-[90vw] max-w-[450px]" :ui="customModal">
		<div class="rounded bg-zinc-800 p-4 shadow-lg">
			<div class="mb-10 flex flex-col gap-3 text-white">
				<span>Select a Camera</span>
				<select v-model="selectedVideoDeviceId" class="rounded-lg bg-zinc-700 p-2">
					<option v-for="device in videoDevices" :value="device.deviceId" :key="device.deviceId">
						{{ device.label }}
					</option>
				</select>
				<span>Select a Microphone</span>
				<select v-model="selectedAudioDeviceId" class="rounded-lg bg-zinc-700 p-2">
					<option v-for="device in audioDevices" :value="device.deviceId" :key="device.deviceId">
						{{ device.label }}
					</option>
				</select>
				<span>Select a Speaker</span>
				<select v-model="selectedOutputDeviceId" class="rounded-lg bg-zinc-700 p-2">
					<option v-for="device in audioOutput" :value="device.deviceId" :key="device.deviceId">
						{{ device.label }}
					</option>
				</select>
			</div>
			<Button class="float-right bg-sky-500 p-2 hover:bg-sky-600" @click="saveSelections">Save</Button>
			<UButton variant="ghost" color="gray" type="button" @click="isOpen = false">Cancel</UButton>
		</div>
	</UModal>
</template>

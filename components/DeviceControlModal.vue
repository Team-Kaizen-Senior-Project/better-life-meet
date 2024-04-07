<script setup>
	import { Cog6ToothIcon } from '@heroicons/vue/24/outline'
	const isOpen = ref(false)
	const media = useMediaStore()
	const customModal = {
		overlay: {
			background: 'bg-zinc-900/90 dark:bg-gray-800/75',
		},
	}
	onMounted(async () => {
		await media.initDeviceSources()
	})

	function saveSelections() {
		media.setVideoSourceId(media.state.videoSourceId)
		media.setAudioSourceId(media.state.audioSourceId)
		media.setOutputSourceId(media.state.outputSourceId)

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
				<select v-model="media.state.videoSourceId" class="rounded-lg bg-zinc-700 p-2">
					<option v-for="device in media.state.videoDevices" :value="device.deviceId" :key="device.deviceId">
						{{ device.label }}
					</option>
				</select>
				<span>Select a Microphone</span>
				<select v-model="media.state.audioSourceId" class="rounded-lg bg-zinc-700 p-2">
					<option v-for="device in media.state.audioDevices" :value="device.deviceId" :key="device.deviceId">
						{{ device.label }}
					</option>
				</select>
				<span>Select a Speaker</span>
				<select v-model="media.state.outputSourceId" class="rounded-lg bg-zinc-700 p-2">
					<option v-for="device in media.state.outputDevices" :value="device.deviceId" :key="device.deviceId">
						{{ device.label }}
					</option>
				</select>
			</div>
			<Button class="float-right bg-sky-500 p-2 hover:bg-sky-600" @click="saveSelections">Save</Button>
			<UButton variant="ghost" class="text-gray-400" type="button" @click="isOpen = false">Cancel</UButton>
		</div>
	</UModal>
</template>

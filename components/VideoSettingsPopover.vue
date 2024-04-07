<script setup>
	import { CheckIcon, ChevronUpIcon } from '@heroicons/vue/24/outline'
	import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
	const media = useMediaStore()
	const popoverOpen = ref(false)
	const { hmsActions } = useHms()
	async function changeVideoSource(deviceId) {
		await media.setVideoSourceId(deviceId)
		await hmsActions.setVideoSettings({ deviceId: media.state?.videoSourceId })
		popoverOpen.value = false
	}
</script>

<template>
	<Popover v-model:open="popoverOpen">
		<PopoverTrigger as-child>
			<ChevronUpIcon class="absolute right-0 top-0 h-4 w-4 text-gray-300 hover:rounded hover:border" />
		</PopoverTrigger>
		<PopoverContent class="w-80 border-transparent bg-zinc-900" align="start">
			<span className="text-white text-lg p-2 mb-10">Select a Camera</span>
			<div
				v-for="device in media.state.videoDevices"
				:key="device.deviceId"
				@click="changeVideoSource(device.deviceId)"
				class="flex gap-2 p-2 text-sm text-gray-300 hover:cursor-pointer hover:text-gray-500"
			>
				<CheckIcon class="h-5 w-5" v-if="media.state.videoSourceId === device.deviceId" />
				{{ device?.label }}
			</div>
		</PopoverContent>
	</Popover>
</template>

<style scoped></style>

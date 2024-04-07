<script setup>
	import { CheckIcon, ChevronUpIcon } from '@heroicons/vue/24/outline'
	import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
	import { Button } from '~/components/ui/button'
	const media = useMediaStore()
	const popoverOpen = ref(false)
	const { hmsActions } = useHms()

	async function changeAudioSource(deviceId) {
		await media.setAudioSourceId(deviceId)
		await hmsActions.setAudioSettings({ deviceId: media.state?.audioSourceId })
		popoverOpen.value = false
	}
</script>

<template>
	<Popover v-model:open="popoverOpen">
		<PopoverTrigger as-child>
			<ChevronUpIcon class="absolute right-0 h-4 w-4 text-gray-300 hover:rounded hover:border" />
		</PopoverTrigger>
		<PopoverContent class="w-80 border-transparent bg-zinc-900" align="start">
			<span className="text-white text-lg p-2 mb-10">Select a Microphone</span>
			<div
				v-for="device in media.state.audioDevices"
				:key="device.deviceId"
				@click="changeAudioSource(device.deviceId)"
				class="flex gap-2 p-2 text-sm text-gray-300 hover:cursor-pointer hover:text-gray-500"
			>
				<CheckIcon class="h-5 w-5" v-if="media.state.audioSourceId === device.deviceId" />
				{{ device?.label }}
			</div>
		</PopoverContent>
	</Popover>
</template>

<style scoped></style>

<script setup>
	import { CheckIcon } from '@heroicons/vue/24/outline'
	import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
	import Button from './Button.vue'
	const media = useMediaStore()
	const popoverOpen = ref(false)
	const { hmsActions } = useHms()

	async function changeOutput(deviceId) {
		await media.setOutputSourceId(deviceId)
		await hmsActions.setAudioOutputDevice(media.state?.outputSourceId)
		popoverOpen.value = false
	}
</script>

<template>
	<Popover v-model:open="popoverOpen">
		<PopoverTrigger as-child>
			<Button class="rounded px-5 py-3">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="h-5 w-5 text-green-500 hover:scale-105 hover:text-green-600"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
					/>
				</svg>
			</Button>
		</PopoverTrigger>
		<PopoverContent class="w-80 border-transparent bg-zinc-900" align="start">
			<span className="text-white text-lg p-2 mb-10">Select a Speaker</span>
			<div
				v-for="device in media.state.outputDevices"
				:key="device.deviceId"
				@click="changeOutput(device.deviceId)"
				class="flex gap-2 p-2 text-sm text-gray-300 hover:cursor-pointer hover:text-gray-500"
			>
				<CheckIcon class="h-5 w-5" v-if="media.state.outputSourceId === device.deviceId" />
				{{ device?.label }}
			</div>
		</PopoverContent>
	</Popover>
</template>

<style scoped></style>

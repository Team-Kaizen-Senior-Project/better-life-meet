<script setup>
import { MicrophoneIcon, VideoCameraIcon, VideoCameraSlashIcon, CheckIcon, ChevronUpIcon } from '@heroicons/vue/24/outline'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { Button } from '~/components/ui/button'
const media = useMediaStore()
const popoverOpen = ref(false)
const { hmsActions, hmsStore, selectLocalMediaSettings } = useHms()

async function changeAudioSource(deviceId) {
    console.log(deviceId)
    await media.setAudioSourceId(deviceId)
    await hmsActions.setAudioSettings({ deviceId: media.state?.audioSourceId })
    const selected = hmsStore.getState(selectLocalMediaSettings);
    console.log(selected)
    console.log(media.state.audioSourceId)
    popoverOpen.value = false
}
</script>

<template>
    <Popover v-model:open="popoverOpen">
        <PopoverTrigger as-child>
            <ChevronUpIcon class="w-5 h-5 text-gray-300 absolute right-0 hover:border hover:rounded" />
        </PopoverTrigger>
        <PopoverContent class="w-80 border-transparent bg-zinc-900" align="start">
            <span className="text-white text-lg p-2 mb-10">Select a Microphone</span>
            <div v-for="device in media.state.audioDevices" :key="device.deviceId"
                @click="changeAudioSource(device.deviceId)"
                class="p-2 text-gray-300 hover:text-gray-500 text-sm hover:cursor-pointer flex gap-2">
                <CheckIcon class="w-5 h-5" v-if="media.state.audioSourceId === device.deviceId" />
                {{ device?.label }}
            </div>
        </PopoverContent>
    </Popover>
</template>

<style scoped></style>

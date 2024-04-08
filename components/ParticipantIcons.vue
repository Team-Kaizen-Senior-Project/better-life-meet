<script setup lang="ts">
	import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
	import { MicrophoneIcon, VideoCameraIcon, VideoCameraSlashIcon } from '@heroicons/vue/24/outline'


	const { isConnected, peers, peersWithAudioStatus } = useHms()

	const hashCode = (str: string) => {
		//  djb2 hash function  - picked for seperation of hashes
		let hash = 5381
		for (let i = 0; i < str.length; i++) {
			hash = (hash * 33) ^ str.charCodeAt(i)
		}
		return hash >>> 0
	}

	const generateColor = (firstName: string | undefined, lastName: string | undefined) => {
		// hsl class for unique customer icon color
		let color: string
		if (firstName && lastName) {
			const hash = hashCode(firstName + lastName)
			const hue = hash % 360
			const sat = hash % 100
			color = `hsl(${hue}, ${sat}%, 60%, 0.90)`
		} else {
			color = `hsl(35, 3%, 84%, 0.80)` // default
		}
		return color
	}

	const popoverOpen = ref(false)
</script>

<template>
	<Popover style="padding-bottom: 30px">
		<PopoverTrigger class="flex items-center">
			<div
				v-for="(peer, index) in peers"
				:key="peer.id"
				class="absolute"
				:style="{ left: 'calc(50% - ' + index * -30 + 'px' }"
			>
				<button v-if="index < 3"
					@click="popoverOpen = true"
					class="inline-block aspect-[1/1] h-10 w-10 rounded-full text-white"
					:style="{ backgroundColor: generateColor(peer.name.split(' ')[0], peer.name.split(' ')[1]) }"
				>
					{{ peer.name.split(' ')[0][0] }}{{ peer.name.split(' ')[1][0] }}
				</button>
				<button v-else-if="index == 3"
					@click="popoverOpen = true"
					class="inline-block aspect-[1/1] h-10 w-10 rounded-full text-white background-color-"
					:style="{ backgroundColor: 'hsla(0, 0%, 32%, 0.85)' }"
					>
					...
				</button>
			</div>
		</PopoverTrigger>
		<PopoverContent class="w-80 bg-zinc-900" align="center" style="margin-bottom: 50px; margin-left: 80px">
			<div class="space-y-4">
				<h4 class="text-sm font-medium text-white">Participants ({{ peers.length }})</h4>
				<div v-for="(peerWithAudioStatus) in peersWithAudioStatus" :key="peerWithAudioStatus.id">
					<div class="flex items-center justify-between">
						<button
							class="inline-block aspect-[1/1] h-8 w-8 rounded-full text-white"
							:style="{ backgroundColor: generateColor(peerWithAudioStatus.peer.name.split(' ')[0], peerWithAudioStatus.peer.name.split(' ')[1]) }">
							{{ peerWithAudioStatus.peer.name.split(' ')[0][0] }}{{ peerWithAudioStatus.peer.name.split(' ')[1][0] }}
						</button>
						<p class="text-sm font-light text-white" style="padding-right: 100px">
							{{ peerWithAudioStatus.peer.name }}
						</p>
						<MicrophoneIcon v-if="peerWithAudioStatus.isAudioEnabled" class="h-5 w-5 text-green-500" />
						<svg
							v-else
							class="h-5 w-5 text-red-500"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							strokeWidth="{1.5}"
							viewBox="0 0 24 24"
							stroke="currentColor"
							className="w-6 h-6"
						>
							<path strokeLinecap="round" strokeLinejoin="round" d="M19 19L17.591 17.591L5.409 5.409L4 4" />
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 18.75C13.5913 18.75 15.1174 18.1179 16.2426 16.9926C17.3679 15.8674 18 14.3413 18 12.75V11.25M12 18.75C10.4087 18.75 8.88258 18.1179 7.75736 16.9926C6.63214 15.8674 6 14.3413 6 12.75V11.25M12 18.75V22.5M8.25 22.5H15.75M12 15.75C11.2044 15.75 10.4413 15.4339 9.87868 14.8713C9.31607 14.3087 9 13.5456 9 12.75V4.5C9 3.70435 9.31607 2.94129 9.87868 2.37868C10.4413 1.81607 11.2044 1.5 12 1.5C12.7956 1.5 13.5587 1.81607 14.1213 2.37868C14.6839 2.94129 15 3.70435 15 4.5V12.75C15 13.5456 14.6839 14.3087 14.1213 14.8713C13.5587 15.4339 12.7956 15.75 12 15.75Z"
							/>
						</svg>
					</div>
				</div>
			</div>
		</PopoverContent>
	</Popover>
</template>

<style scoped>
	.absolute {
		position: absolute;
	}
</style>

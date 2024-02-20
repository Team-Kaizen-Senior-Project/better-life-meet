<script setup lang="ts">
	import { io } from 'socket.io-client'
	import { useRouter, useRoute } from 'vue-router'
	import useConfirmNavigation from '../../../composables/useConfirmationNavigation' // Adjust the path as necessary

	definePageMeta({
		layout: 'meeting',
	})

	const router = useRouter()
	const route = useRoute()
	const meetingId = route.params.id

	// Connect to websocket server
	const ws = io()
	const { setupConfirmNavigation, removeConfirmNavigation } = useConfirmNavigation()

	onMounted(() => {
		setupConfirmNavigation()
	})

	onBeforeUnmount(() => {
		removeConfirmNavigation()
	})
</script>

<template>
	<PodHeader />
	<div class="flex min-h-[82vh] items-center justify-center bg-zinc-800">
		<div class="grid h-[70vh] w-[80vw] grid-cols-4 grid-rows-2 gap-3">
			<!-- Local user's video feed -->
			<div class="relative overflow-hidden rounded-lg bg-zinc-900" v-if="true">
				<LocalVideo />
				<p class="absolute bottom-0 left-0 bg-black px-2 py-1.5 text-white">Local User</p>
			</div>

			<!-- External users' video feeds -->
			<!-- <div class="relative overflow-hidden rounded-lg bg-zinc-900" v-for="stream in externalStreams" :key="stream.id">
				<ExternalVideo :stream="stream.stream" />
				<p class="absolute bottom-0 left-0 bg-black px-2 py-1.5 text-white">{{ stream.id }}</p>
			</div> -->
		</div>
	</div>
	<BreakoutRoomModal :meetingRef="meetingId" />
	<PodFooter />
</template>

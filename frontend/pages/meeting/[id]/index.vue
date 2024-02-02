<script setup>
	// Simulated array of external streams.
	// Each item in the array represents a stream object for an external user.
	const externalStreams = ref([
		{ id: 'user1', stream: null },
		{ id: 'user2', stream: null },
	])

	const route = useRoute()
	const meetingId = route.params.id

	definePageMeta({
		layout: 'meeting',
	})

	const video = useVideoStore()

	// Computed property to determine if there are any external streams
	const hasExternalStreams = computed(() => externalStreams.value.length > 0)
</script>

<template>
	<PodHeader />
	<p class="text-white">meeting id: {{ meetingId }}</p>
	<div class="flex min-h-[82vh] items-center justify-center bg-zinc-800">
		<div class="grid h-[70vh] w-[80vw] grid-cols-4 grid-rows-2 gap-3">
			<!-- Local user's video feed -->
			<div
				class="relative overflow-hidden rounded-lg bg-zinc-900"
				v-if="video.cameraActive && video.joinedMeeting && !video.modalOpen"
			>
				<VideoPreview :cameraActive="video.cameraActive" />
				<p class="absolute bottom-0 left-0 bg-black px-2 py-1.5 text-white">Local User</p>
			</div>

			<!-- External users' video feeds -->
			<div class="relative overflow-hidden rounded-lg bg-zinc-900" v-for="stream in externalStreams" :key="stream.id">
				<ExternalVideo :stream="stream.stream" />
				<p class="absolute bottom-0 left-0 bg-black px-2 py-1.5 text-white">{{ stream.id }}</p>
			</div>
		</div>
	</div>
	<BreakoutRoomModal />
	<PodFooter />
</template>

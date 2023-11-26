<script setup>
	import { Cog6ToothIcon } from '@heroicons/vue/24/outline'
	import { VideoCameraSlashIcon } from '@heroicons/vue/24/outline'
	import { VideoCameraIcon } from '@heroicons/vue/24/outline'
	import { MicrophoneIcon } from '@heroicons/vue/24/solid'

	const video = useVideoStore()
	const isCameraOn = ref(false)
	const videoPreview = ref(null)

	const customModal = ref({
		overlay: {
			background: 'bg-zinc-900/90',
		},
	})

	function startUp() {
		const videoElement = videoPreview.value
		// Handle permissions for camera if needed
		navigator.mediaDevices
			.getUserMedia({ video: true, audio: false })
			.then(function (stream) {
				if (!isCameraOn.value) {
					videoElement.classList.remove('hidden')
					videoElement.srcObject = stream
					videoElement.play()
				} else {
					stopRecording()
				}
			})
			.catch(function (err) {
				console.error(err)
			})

		videoElement.addEventListener(
			'canplay',
			function (ev) {
				isCameraOn.value = true
			},
			false,
		)
	}
	function stopRecording() {
		videoPreview.value.classList.add('hidden')
		videoPreview.value.srcObject.getTracks().forEach((track) => track.stop())
		isCameraOn.value = false
	}
	function joinMeeting() {
		console.log('in join meeting')
		const videoElement = document.getElementById('demo-video-element')
		modalIsOpen.value = false
		navigator.mediaDevices
			.getUserMedia({ video: true, audio: false })
			.then(function (stream) {
				console.log(isCameraOn.value)
				if (isCameraOn.value) {
					videoElement.srcObject = stream
					videoElement.play()
				}
			})
			.catch(function (err) {
				console.error(err)
			})
		videoElement.addEventListener(
			'canplay',
			function (ev) {
				isCameraOn.value = true
			},
			false,
		)
	}
	// onMounted(() => {
	// 	// Setting this to true in the ref initially breaks the close modal
	// 	video.modalOpen = true
	// })
</script>
<template>
	<UModal v-model="video.modalOpen" class="max-w-[400px]" :ui="customModal">
		<!-- <div class="rounded bg-zinc-800 p-4 shadow-lg">
			<div class="mb-2">
				<p class="text-lg font-semibold text-white">Pod accountability meeting is starting</p>
				<p class="text-gray-200">
					This is your chance to make sure your camera is setup and your microphone is working
				</p>
			</div>
			<div class="flex h-[360px] w-full items-center justify-center rounded-md border border-dashed">
				<div v-if="isCameraOn === false" class="h-[4rem] w-[4rem] text-white"><VideoCameraSlashIcon /></div>
				<video ref="videoPreview" class="hidden rounded-md"></video>
			</div>
			<div class="mt-2 flex flex-col gap-2">
				<MicControls box-length="50" />
				<div class="flex justify-between">
					<div class="flex gap-2">
						<Button class="h-10 w-10"><Cog6ToothIcon /></Button>
						<Button @click="startUp" class="h-10 w-10">
							<VideoCameraSlashIcon v-if="isCameraOn === false" />
							<VideoCameraIcon v-if="isCameraOn === true" />
						</Button>
						<Button class="h-10 w-10"><MicrophoneIcon /></Button>
					</div>
					<button
						type="button"
						@click="joinMeeting"
						class="rounded-md bg-sky-500 px-3 py-1.5 font-medium text-white hover:bg-sky-600"
					>
						Join
					</button>
				</div>
			</div>
		</div> -->
		<VideoSettings
			title="Pod accountability meeting is starting"
			description="This is your chance to make sure your camera is setup and your microphone is working"
			:boxLength="50"
		>
			<template #join>
				<Button
					type="button"
					@click="video.joinMeeting"
					class="rounded-md bg-sky-500 font-medium text-white hover:bg-sky-600"
				>
					Join
				</Button>
			</template>
		</VideoSettings>
	</UModal>
</template>

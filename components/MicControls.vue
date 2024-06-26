<script setup>
	const micLevel = ref(0)
	const isTestingMic = ref(false)
	let audioContext
	let analyser
	let intervalId
	const boxLength = ref(55)
	const boxLengths = {
		sm: 30,
		md: 45,
		lg: 38,
		xl: 55,
	}
	const media = useMediaStore()
	onMounted(() => {
		function updateBoxLength() {
			if (window.innerWidth < 768) {
				boxLength.value = boxLengths.sm
			} else if (window.innerWidth < 1024) {
				boxLength.value = boxLengths.md
			} else if (window.innerWidth < 1280) {
				boxLength.value = boxLengths.lg
			} else {
				boxLength.value = boxLengths.xl
			}
		}
		updateBoxLength()
		window.addEventListener('resize', () => {
			updateBoxLength()
		})
	})

	const MAX_LEVEL = 100 // Max level of micLevel

	async function startMicTest() {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: { deviceId: media.state.audioSourceId ? { exact: media.state.audioSourceId } : undefined },
			})
			if (!audioContext) {
				audioContext = new (window.AudioContext || window.webkitAudioContext)()
			}
			analyser = audioContext.createAnalyser()
			const microphone = audioContext.createMediaStreamSource(stream)
			microphone.connect(analyser)
			analyser.fftSize = 256
			const bufferLength = analyser.frequencyBinCount
			const dataArray = new Uint8Array(bufferLength)

			intervalId = setInterval(() => {
				analyser.getByteTimeDomainData(dataArray)
				// Normalize the array
				let sum = 0
				for (let i = 0; i < bufferLength; i++) {
					sum += (dataArray[i] - 128) * (dataArray[i] - 128)
				}
				let volume = Math.sqrt(sum / bufferLength)
				micLevel.value = (volume / 128) * 100 // Scale the volume to a percentage
			}, 100)
		} catch (err) {
			console.error('Error accessing the microphone', err)
		}
	}

	function stopMicTest() {
		clearInterval(intervalId)
		if (audioContext) {
			audioContext.close()
		}
		audioContext = null
		micLevel.value = 0
		isTestingMic.value = false
	}

	async function toggleMicTest() {
		if (isTestingMic.value) {
			stopMicTest()
			isTestingMic.value = false
		} else {
			await startMicTest()
			isTestingMic.value = true
		}
	}
	onUnmounted(() => {
		stopMicTest() // stop the test when the component unmounts
	})

	// Smoothing function to make the transition less jumpy
	function smoothLevel(level) {
		return Math.sqrt(level) // Applying a square root for a smoother curve
	}

	const filledBoxes = computed(() => {
		let level = smoothLevel(micLevel.value) / Math.sqrt(MAX_LEVEL)
		return Math.ceil(level * boxLength.value)
	})
</script>

<template>
	<div class="grid gap-4 text-white">
		<div class="grid gap-2">
			<span class="text-white">Mic level</span>

			<div class="flex max-w-full items-center gap-2 overflow-x-hidden">
				<Button @click="toggleMicTest" type="primary" class="w-fit whitespace-nowrap">
					{{ isTestingMic ? 'Stop Test' : 'Test Mic' }}
				</Button>
				<div class="flex items-center gap-1">
					<div
						v-for="i in boxLength"
						:key="`level-bar-${i}`"
						:class="[i <= filledBoxes ? 'bg-green-500' : 'bg-neutral-500', 'h-4 w-1 rounded-sm']"
					></div>
				</div>
			</div>
			<!-- Button to toggle the mic test -->
		</div>
	</div>
</template>

<style scoped>
	.slider-vertical {
		writing-mode: bt-lr;
		-webkit-appearance: slider-vertical;
		width: 5px;
	}

	.slider-vertical::-webkit-slider-thumb {
		appearance: none;
		margin-top: -12px;
		background-color: #000000;
		height: 2rem;
		width: 1rem;
	}

	.thumb-horizontal::-moz-range-thumb {
		border: none;
		width: 20px;
		height: 2px;
		background-color: white;
		box-shadow: -4px 0px 0px 4px #3498db;
		cursor: pointer;
	}

	/* .transition-height {
    transition: height 0.3s ease;
} */
</style>

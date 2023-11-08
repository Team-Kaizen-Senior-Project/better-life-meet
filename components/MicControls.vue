<script setup>
import { ref, onUnmounted } from 'vue';

const micLevel = ref(0);
const isTestingMic = ref(false);
let audioContext;
let analyser;
let intervalId;

async function startMicTest() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        intervalId = setInterval(() => {
            analyser.getByteTimeDomainData(dataArray);
            // Normalize the array
            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
                sum += (dataArray[i] - 128) * (dataArray[i] - 128);
            }
            let volume = Math.sqrt(sum / bufferLength);
            micLevel.value = (volume / 128) * 100; // Scale the volume to a percentage
        }, 100);
    } catch (err) {
        console.error('Error accessing the microphone', err);
    }
}

function stopMicTest() {
    clearInterval(intervalId);
    if (audioContext) {
        audioContext.close(); // Close the audio context to clean up
    }
    audioContext = null;
    micLevel.value = 0; // Reset the mic level
    isTestingMic.value = false;
}

function toggleMicTest() {
    console.log(isTestingMic.value)
    if (isTestingMic.value) {
        stopMicTest();
    } else {
        startMicTest();
    }
    isTestingMic.value = !isTestingMic.value;
}
onUnmounted(() => {
    stopMicTest(); // stop the test when the component unmounts
});
</script>

<template>
    <div class="w-full h-full flex flex-col items-center justify-center p-5 space-y-4">
        <!-- Vertical Progress Bar -->
        <div class="w-8 bg-gray-200 rounded h-64 flex flex-col-reverse overflow-hidden">
            <div :style="{ height: `${micLevel}%` }" class="bg-green-500 transition-height duration-300"></div>
        </div>
        <!-- Button to toggle the mic test -->
        <button @click="toggleMicTest" class="px-4 py-2 rounded bg-blue-500 text-white font-bold">
            {{ isTestingMic ? 'Stop Test' : 'Test Mic' }}
        </button>
    </div>
</template>

  
<style scoped>
.slider-vertical {
    writing-mode: bt-lr;
    /* IE */
    -webkit-appearance: slider-vertical;
    /* WebKit */
    width: 8px;
    height: 100%;
    padding: 0;
}

.thumb-horizontal::-webkit-slider-thumb {
    -webkit-appearance: none;
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

.transition-height {
    transition: height 0.3s ease;
}
</style>
  
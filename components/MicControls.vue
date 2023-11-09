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
        audioContext.close();
    }
    audioContext = null;
    micLevel.value = 0;
    isTestingMic.value = false;
}

async function toggleMicTest() {
    if (isTestingMic.value) {
        stopMicTest();
        isTestingMic.value = false;
    } else {
        await startMicTest();
        isTestingMic.value = true;
    }

}
onUnmounted(() => {
    stopMicTest(); // stop the test when the component unmounts
});
</script>

<template>
    <div
        class="w-44 h-72 bg-gray-800 border rounded-md shadow-md flex items-center justify-around gap-3 m-5 p-2 text-white">
        <!-- Vertical Progress Bar -->
        <div class="flex flex-col justify-between items-center gap-2 h-full">
            <span class="text-sm whitespace-nowrap">Mic level</span>
            <div class="w-8 bg-gray-500 rounded h-full flex flex-col-reverse overflow-hidden h-full">
                <div :style="{ height: `${micLevel * 2}%` }" class="bg-green-500 transition-height duration-300"></div>
            </div>
            <!-- Button to toggle the mic test -->
            <button @click="toggleMicTest" class="p-1 rounded bg-blue-500 text-white text-sm whitespace-nowrap">
                {{ isTestingMic ? 'Stop Test' : 'Test Mic' }}
            </button>
        </div>


        <!-- Volume Control Slider -->
        <div class="flex flex-col justify-center items-center gap-2  h-full">
            <div class="flex flex-col items-center h-full">
                <span class="mb-2 text-sm whitespace-nowrap">Mic volume</span>
                <input v-model="micVolume" type="range" min="0" max="100"
                    class="h-full mb-9 bg-transparent appearance-none slider-vertical thumb-horizontal" />
            </div>
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

.transition-height {
    transition: height 0.3s ease;
}
</style>
  
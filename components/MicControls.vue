<template>
    <div class="w-40 h-64 p-4 bg-gray-100 border rounded-md shadow-md flex items-center justify-around gap-3 p-5 m-5">
        <!-- Mic Level Slider -->
        <div class="space-y-2">
            <div class="w-8 rounded flex flex-col gap-1 p-1">
                <div v-for="level in levels" :key="level" :class="[
                    'h-1 rounded transition-opacity duration-300 bg-red-200',
                    level <= micLevel ? 'bg-green-500' : 'bg-gray-600',
                    { 'opacity-0': !isTestingMic },
                ]"></div>
            </div>
            <button class="px-4 py-2 rounded bg-blue-500 text-white" @click="toggleMicTest">
                {{ isTestingMic ? 'Stop Test' : 'Test Mic' }}
            </button>
        </div>

        <div class="flex flex-col items-center h-full">
            <span class="mb-2 text-sm whitespace-nowrap">Mic volume</span>
            <input v-model="micVolume" type="range" min="0" max="100"
                class="w-2 h-48 bg-transparent appearance-none slider-vertical thumb-horizontal" />
        </div>
    </div>
</template>
  
<script>
import { ref } from 'vue';
export default {
    data() {
        const micLevel = ref(0);
        const levels = ref(Array.from({ length: 20 }, (_, i) => i + 1).reverse());
        const isTestingMic = ref(false);
        let audioContext = null;
        let analyser = null;
        let microphone = null;
        let intervalId = null;
        function startMicTest() {
            intervalId = setInterval(() => {
                // Simple simulation: cycle through levels 1-10
                micLevel.value = (micLevel.value % 10) + 1;

                // For a more random simulation, uncomment the line below
                // micLevel.value = Math.floor(Math.random() * 10) + 1;
            }, 100); // Update every 100 milliseconds
            // navigator.mediaDevices.getUserMedia({ audio: true })
            //     .then((stream) => {
            //         audioContext = new AudioContext();
            //         analyser = audioContext.createAnalyser();
            //         microphone = audioContext.createMediaStreamSource(stream);
            //         microphone.connect(analyser);
            //         analyser.fftSize = 256;
            //         const bufferLength = analyser.frequencyBinCount;
            //         const dataArray = new Uint8Array(bufferLength);

            //         const getVolume = () => {
            //             analyser.getByteFrequencyData(dataArray);
            //             let sum = 0;
            //             for (let i = 0; i < bufferLength; i++) {
            //                 sum += dataArray[i];
            //             }
            //             micLevel.value = Math.min(Math.floor(sum / bufferLength / 2.56), 10);
            //         };

            //         intervalId = setInterval(getVolume, 100);
            //     })
            //     .catch((error) => {
            //         console.error('Error accessing the microphone', error);
            //     });
        }

        function stopMicTest() {
            // if (audioContext) {
            //     audioContext.close();
            // }
            // if (intervalId) {
            //     clearInterval(intervalId);
            // }
            // audioContext = null;
            // analyser = null;
            // microphone = null;
            // intervalId = null;
            // micLevel.value = 0; // Reset mic level to 0
            if (intervalId) {
                clearInterval(intervalId);
            }
            micLevel.value = 0; // Reset mic level to 0
        }

        function toggleMicTest() {
            if (isTestingMic.value) {
                stopMicTest();
            } else {
                startMicTest();
            }
            isTestingMic.value = !isTestingMic.value;
            console.log(levels)
        }

        onUnmounted(() => {
            stopMicTest();
        });
        return {
            micLevel,
            isTestingMic,
            levels,
            micVolume: 50  // Sample value
        };
    }
}




</script>
  
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
</style>
  
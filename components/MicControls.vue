<template>
    <div class="w-40 h-64 p-4 bg-gray-100 border rounded-md shadow-md flex items-center justify-around gap-3 p-5 m-5">

        <!-- Mic Level Slider -->
        <div class="flex flex-col items-center">
            <span class="mb-2 text-sm">Mic level</span>
            <div class="relative w-2 h-48 bg-gray-300 rounded">
                <div :style="{ height: micLevel + '%' }" class="absolute bottom-0 w-2 bg-green-500 rounded"></div>
            </div>
        </div>

        <!-- Volume Control Slider -->
        <div class="flex flex-col items-center h-full">
            <span class="mb-2 text-sm whitespace-nowrap">Mic volume</span>
            <input v-model="micVolume" type="range" min="0" max="100"
                class="w-2 h-48 bg-transparent appearance-none slider-vertical thumb-horizontal" />

        </div>

    </div>
</template>
  
<script>
export default {
    data() {
        return {
            micLevel: 50,  // Sample value
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
  
<template>
  <div class="bg-black p-6 rounded-lg w-full sm:w-[800px] mx-auto">
    <h1 class="text-white text-xl">Video Settings</h1>
    <div class="text-white mb-4">
    </div>
    <div class="flex justify-between">
      <div class="flex-grow w-full h-96 bg-gray-800 text-white flex items-center justify-center rounded mb-5 mr-4">
  <span class="text-gray-400"><i class="fas fa-video-slash"></i></span>
</div>
      <div class="flex flex-row justify-between">
  <div class="flex flex-col items-center mb-4">
    <label class="text-white mb-2">Mic level</label>
    <div class="level-container mb-4">
      <div v-for="i in 40" :key="`level-bar-${i}`" class="level-bar rounded-sm"></div>
    </div>
    <button class="w-20 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring">
      Test Mic
    </button>
  </div>

  <div class="flex flex-col items-center">
    <label class="text-white ml-2 mb-2 whitespace-nowrap">Mic volume</label>
    <input type="range" min="0" max="100" class="slider slider-vertical" orient="vertical" />
  </div>
</div>

    </div>
    <div class="flex justify-left space-x-2 mt-4"> 
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css" />
          <button class="p-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white focus:outline-none focus:ring">
            <i class="fas fa-cog"></i>
          </button>
          <button class="p-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white focus:outline-none focus:ring">
            <i class="fas fa-video-slash"></i>
          </button>
          <button class="p-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white focus:outline-none focus:ring">
            <i class="fas fa-microphone-slash"></i>
          </button>
        </div>
  </div>
  
</template>

  
  <style scoped>
  .slider-vertical {
    -webkit-appearance: slider-vertical;
    width: 10px;
    height: 300px;
    padding: 0 5px;
  }
  
  .slider-vertical::-webkit-slider-thumb {
    -webkit-appearance: none;
    border: 1px solid #000000;
    height: 20px;
    width: 20px;
    background: #4CAF50;
    cursor: pointer;
  }
  
  .slider-vertical::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: #4CAF50;
    cursor: pointer;
  }
  
  .slider-vertical::-ms-thumb {
    width: 20px;
    height: 10px;
    background: #4CAF50;
    cursor: pointer;
  }

  .level-container {
  display: flex;
  flex-direction: column;
  height: 300px; /* Adjust as needed */
  justify-content: space-between;
}

.level-bar {
  background-color: #444;
  width: 20px;
  height: 10%;
  margin-bottom: 2px;
  border-radius: 10px; /* This creates the rounded corners */
}

.level-bar.active {
  background-color: #4caf50; 
  border-radius: 10px; /* Ensure the active state also has rounded corners */
}


  </style>
  
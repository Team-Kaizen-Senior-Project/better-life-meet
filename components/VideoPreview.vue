<template>
      <video ref="videoElement" autoplay playsinline></video>
  </template>
  
  <script setup>
  
  const props = defineProps({
    cameraActive: Boolean
  })
  
  const videoElement = ref(null)
  
  watchEffect(async (onInvalidate) => {
    if (props.cameraActive) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoElement.value) {
          videoElement.value.srcObject = stream
        }
      } catch (error) {
        console.error('Error accessing the camera', error)
      }
    } else {
      if (videoElement.value && videoElement.value.srcObject) {
        const tracks = videoElement.value.srcObject.getTracks()
        tracks.forEach(track => track.stop())
        videoElement.value.srcObject = null
      }
    }
  
    // Cleanup function to stop the camera when the component is unmounted or the cameraActive prop changes
    onInvalidate(() => {
      if (videoElement.value && videoElement.value.srcObject) {
        const tracks = videoElement.value.srcObject.getTracks()
        tracks.forEach(track => track.stop())
        videoElement.value.srcObject = null
      }
    })
  })
  </script>
  
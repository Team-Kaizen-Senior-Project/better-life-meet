<template>
    <!-- Your template here -->
    <button @click="toggle">Toggle</button>
    <div v-if="state.isVisible">Content</div>
</template>
  
<script setup>
import { ref } from 'vue';

const state = ref({
    isVisible: false,
});

function toggle() {
    state.value.isVisible = !state.value.isVisible;
    console.log("test")
}
</script>
  
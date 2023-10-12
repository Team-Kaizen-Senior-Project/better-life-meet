<script setup>
  const route = useRoute()
</script>

<template>
  <div class="app" :data-route="route.name">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

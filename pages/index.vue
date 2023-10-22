<script setup>
</script>

<template>
  <div>
    <div class="content">

      <p>
        <a @click="$auth.login()" class="link">Sign in</a>
      </p>
    </div>
  </div>
</template>
<style scoped>
.count {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

h3 {
  margin: 0;
}
</style>

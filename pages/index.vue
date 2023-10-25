<script setup>
const counter = useCounterService()
</script>

<template>
  <section class="page-header">
    <inner-column>
      <h1>Index Page</h1>
      <HabitsList />
      <h2>Example of a pinia service</h2>
      <p>
        Increment or decrement, and then go to the
        <NuxtLink href="/profile">profile page</NuxtLink>
      </p>
      <div class="count">
        <button @click="counter.decrement()">-</button>
        <h3>{{ counter.count }}</h3>
        <button @click="counter.increment()">+</button>
        <button @click="counter.reset()">Reset</button>
      </div>
    </inner-column>
  </section>
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

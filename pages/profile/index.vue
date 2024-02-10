<script setup>
	const counter = useCounterService()
</script>

<template>
	<h1>Example page to show routes and how the store works</h1>
	<p>Count value: {{ counter.count }}</p>
</template>

<style></style>

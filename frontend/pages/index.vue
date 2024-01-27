<template>
	<div class="flex h-screen items-center justify-center text-white">
		<Button class="text-3xl">
			<NuxtLink to="/dashboard">Dashboard</NuxtLink>
		</Button>
	</div>
</template>

<script setup lang="ts">
	// import { io } from 'socket.io-client'
	// const ws = io({ path: '/wss' })
	// ws.emit("greet", "Hello, world!");

	// import { detectDevice } from 'mediasoup-client'
	// const handlerName = detectDevice()
	// if (handlerName) {
	// 	console.log('detected handler: %s', handlerName)
	// } else {
	// 	console.warn('no suitable handler found for current browser/device')
	// }
</script>

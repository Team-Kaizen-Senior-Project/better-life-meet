<script setup>
	const route = useRoute()
	import { Toaster } from '~/components/ui/sonner'
</script>

<template>
	<div class="app flex min-h-screen flex-col" :data-route="route.name">
		<NuxtLayout>
			<NuxtPage />
			<Toaster />
		</NuxtLayout>
	</div>
</template>

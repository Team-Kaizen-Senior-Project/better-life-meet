<script setup>
	const route = useRoute()
	import { Toaster } from '~/components/ui/sonner'
	useHead({
		link: [
			{
				rel: 'icon',
				type: 'image/png',
				href: '/favicon.png',
			},
		],
	})
</script>

<template>
	<Head>
		<link rel="icon" href="/favicon.png" />
	</Head>
	<div class="app flex h-screen flex-col" :data-route="route.name">
		<NuxtLayout>
			<NuxtPage />
			<Toaster />
		</NuxtLayout>
	</div>
</template>

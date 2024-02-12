<script setup>
	const route = useRoute()

</script>

<template>
	<div class="app flex min-h-screen flex-col" :data-route="route.name">
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</div>
</template>

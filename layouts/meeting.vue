<script setup></script>

<template>
	<PodHeader />

	<main id="page-content" class="flex-grow overflow-auto bg-zinc-800 p-4">
		<slot />
	</main>

	<PodFooter />
</template>

<style></style>

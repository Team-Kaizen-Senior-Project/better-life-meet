<script setup lang="ts"></script>

<template>
	<header class="site-header">
		<MastHead>
			<template #end>
				<slot name="end" />
			</template>
		</MastHead>
		<slot name="menuAfter" />
	</header>

	<main id="page-content" class="flex-grow bg-zinc-800">
		<slot />
	</main>

	<SiteFooter />
</template>

<style></style>

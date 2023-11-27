<template>
	<div class="bg-zinc-800p py-14">
		<inner-column>
			<!-- Ensures full height of screen and sets a light background -->
			<h1 class="mb-10 text-left text-5xl font-bold text-white">All Pods</h1>
			<!-- Large, bold text with padding -->
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				<LoneRangerPod />
				<Pod podNumber="Pod 231" joinText="Join pod meeting" />
				<Pod podNumber="Pod 20" />
				<Pod podNumber="Pod 30" />
				<Pod podNumber="Pod 42" />
				<Pod podNumber="Pod 58" />
				<Pod podNumber="Pod 78" />
				<Pod podNumber="Pod 99" />
				<Pod podNumber="Pod 120" />
				<Pod podNumber="Pod 140" />
			</div>
		</inner-column>
	</div>
</template>

<script setup></script>

<style>
	/* Additional styles if necessary */
</style>

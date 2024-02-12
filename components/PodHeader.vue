<script setup>
	import { ChevronDownIcon } from '@heroicons/vue/24/outline'
	const customer = await fetchAuthenticatedCustomer()
</script>
<template>
	<header class="bg-black py-4">
		<div class="mx-auto flex w-[90vw] max-w-[1600px] items-center justify-between">
			<div class="flex items-center gap-2">
				<p class="text-lg font-medium text-white">Weekly Pod Accountability Meeting</p>
				<button
					class="flex items-center gap-1 rounded-lg bg-sky-500 px-3 py-2 font-medium text-white hover:bg-sky-600"
					data-testid="view-schedule"
				>
					View Schedule
					<ChevronDownIcon class="h-3 w-3" />
				</button>
			</div>
			<div class="flex items-center gap-2">
				<button class="aspect-square h-[2rem] w-[2rem] rounded-full bg-gray-200 text-lg">U</button>
				<div class="flex flex-col text-sm text-white">
					<p>{{ customer['user']['firstName'] }}</p>
					<p>{{ customer['user']['email'] }}</p>
				</div>
			</div>
		</div>
	</header>
</template>

<style scoped></style>

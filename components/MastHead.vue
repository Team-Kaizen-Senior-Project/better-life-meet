<script setup lang="ts">
	const { signOut } = useAuth()
	const { state: customerState } = useCustomerStore()
	const customer = computed(() => customerState.customer)
</script>

<template>
	<header class="bg-black py-3">
		<div class="mx-auto flex w-[90vw] max-w-[1600px] items-center justify-between">
			<nav class="mast-head">
				<NuxtLink href="/" class="flex gap-2">
					<img src="/better-life-logo.png" class="w-[8vw]" />
				</NuxtLink>
			</nav>
			<div class="flex items-center gap-2">
				<button class="h-[2rem] w-[2rem] rounded-full bg-gray-200 text-lg">U</button>
				<div class="flex flex-col text-sm text-white">
					<p>{{ customer?.firstName }}</p>
					<p>{{ customer?.email }}</p>
				</div>
				<UButton class="bg-sky-500 hover:bg-blue-600 hover:bg-sky-600" @click="() => signOut()">Sign Out</UButton>
			</div>
		</div>
	</header>
</template>

<style scoped></style>

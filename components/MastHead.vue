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
					<img src="/better-life-logo.png" class="w-[12vw] min-w-[125px] max-w-[150px] 2xl:w-[8vw]" />
				</NuxtLink>
			</nav>
			<div class="flex items-center gap-2">
				<CustomerIcon />
				<div class="flex flex-col text-sm text-white">
					<p class="customer-name">{{ customer?.firstName }}</p>
					<p class="customer-email hidden md:block">{{ customer?.email }}</p>
					<p v-if="customer?.admin" class="font-semibold">Admin</p>
					<p v-else class="font-semibold">Regular User</p>
				</div>
				<UButton class="sign-out bg-sky-500 hover:bg-blue-600" @click="() => signOut()">Sign Out</UButton>
			</div>
		</div>
	</header>
</template>

<style scoped></style>

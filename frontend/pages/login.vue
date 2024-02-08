<script setup lang="ts">
	const { signIn } = useAuth()

	const email = ref('')
	const password = ref('')

	definePageMeta({
		auth: {
			//only unauthenticated users can access this page
			unauthenticatedOnly: true,
			//once user logs in, redirect them to the dashboard
			navigateAuthenticatedTo: '/dashboard',
		},
		layout: false,
	})
</script>

<template>
	<form class="space-y-4 md:space-y-6" @submit.prevent="signIn('credentials', { email, password })">
		<div class="flex h-screen">
			<!-- Left Side (Logo) -->
			<div class="bg-better-life-bg flex w-1/2 items-center justify-center">
				<div class="text-8xl font-extrabold text-white">
					<img src="/better-life-logo.png" alt="Better Life Logo" />
				</div>
			</div>

			<!-- Right Side (Login Form) -->
			<div class="flex w-1/2 items-center justify-center bg-gray-50">
				<div class="w-96 rounded-lg bg-white p-10 shadow-xl">
					<h1 class="mb-6 text-2xl font-bold">Login</h1>

					<div class="space-y-4">
						<input v-model="email" type="email" placeholder="Email" class="w-full rounded border border-gray-300 p-2" />
						<input
							v-model="password"
							type="password"
							placeholder="Password"
							class="w-full rounded border border-gray-300 p-2"
						/>
					</div>

					<button class="mt-6 w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600">Sign in</button>
					<p class="mt-4 cursor-pointer text-sm text-blue-500 hover:underline">Did you forget your password?</p>
				</div>
			</div>
		</div>
	</form>
</template>

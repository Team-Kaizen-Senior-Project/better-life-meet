<script setup lang="ts">
	const { signIn } = useAuth()
	const email = ref('')
	const password = ref('')
	const errorMessage = ref('')

	const mySignInHandler = async () => {
		const { error, url } = await signIn('credentials', {
			email: email.value,
			password: password.value,
			redirect: false,
		})
		if (error) {
			errorMessage.value = 'The username or password is incorrect.'
		} else {
			// No error, continue with the sign in, e.g., by following the returned redirect:
			return navigateTo(url, { external: true })
		}
	}

	definePageMeta({
		auth: {
			//only unauthenticated users can access this page
			unauthenticatedOnly: true,
			//once user logs in, redirect them to the dashboard
			navigateAuthenticatedTo: '/',
		},
		layout: false,
	})
</script>

<template>
	<Head><title>Login</title></Head>
	<form class="space-y-4 md:space-y-6" @submit.prevent="mySignInHandler('credentials', { email, password })">
		<div class="flex h-screen">
			<!-- Left Side (Logo) -->
			<div class="bg-better-life-bg hidden w-1/2 items-center justify-center md:flex">
				<div class="text-8xl font-extrabold text-white">
					<img src="/better-life-logo.png" alt="Better Life Logo" />
				</div>
			</div>

			<!-- Right Side (Login Form) -->
			<div class="flex w-full flex-col items-center justify-center bg-gray-50 md:w-1/2 md:flex-row">
				<img src="/better-life-logo.png" alt="Better Life Logo" class="-mt-8 mb-2 w-[35vw] min-w-[200px] md:hidden" />
				<div class="w-96 rounded-lg bg-white p-10 shadow-xl">
					<h1 class="mb-6 text-2xl font-bold">Login</h1>

					<div class="space-y-4">
						<input
							v-model="email"
							type="email"
							placeholder="Email"
							class="w-full rounded border border-gray-300 p-2"
							data-testid="email"
						/>
						<input
							v-model="password"
							type="password"
							placeholder="Password"
							class="w-full rounded border border-gray-300 p-2"
							data-testid="password"
						/>
						<div v-if="errorMessage" class="mt-2 text-sm text-red-500">
							{{ errorMessage }}
						</div>
					</div>

					<button class="mt-6 w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600" data-testid="sign-in-button">
						Sign in
					</button>
					<p class="mt-4 cursor-pointer text-sm text-blue-500 hover:underline">Did you forget your password?</p>
				</div>
			</div>
		</div>
	</form>
</template>

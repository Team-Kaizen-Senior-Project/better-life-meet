<script setup lang="ts">
const {signIn } = useAuth();

const email = ref('')
const password = ref('')

definePageMeta({
  auth:{
    //only unauthenticated users can access this page
  unathenticatedOnly:true,
  //once user logs in, redirect them to the dashboard
  navigateAuthenticatedTo:"/dashboard",

  },
  layout: false,
});
</script>

<template>
<form class="space-y-4 md:space-y-6" @submit.prevent="signIn('credentials',{email,password})">
  <div class="h-screen flex">
    <!-- Left Side (Logo) -->
    <div class="w-1/2 bg-better-life-bg flex items-center justify-center">
      <div class="text-white text-8xl font-extrabold">
        <img src="/better-life-logo.png" alt="Better Life Logo">
      </div>
    </div>

    <!-- Right Side (Login Form) -->
    <div class="w-1/2 bg-gray-50 flex items-center justify-center">
      <div class="bg-white p-10 rounded-lg shadow-xl w-96">
        <h1 class="text-2xl font-bold mb-6">Login</h1>

        <div class="space-y-4">
          <input v-model="email" type="email" placeholder="Email" class="p-2 w-full rounded border border-gray-300">
          <input v-model="password" type="password" placeholder="Password" class="p-2 w-full rounded border border-gray-300">
        
        </div>

        <button class="mt-6 w-full bg-blue-500 p-2 text-white rounded hover:bg-blue-600">Sign in</button>
        <p class="mt-4 text-sm text-blue-500 hover:underline cursor-pointer">
          Did you forget your password?
        </p>
      </div>
    </div>
  </div>
  </form>
</template>

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // ... other options
  modules: ['@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  imports: {
    dirs: ['./services'],
  },
  pinia: {
    autoImports: ['defineStore', 'acceptHMRUpdate'],
  },
  devtools: {
    enabled: true,
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) =>
        ['inner-column', 'module', 'text-content', 'input-field'].includes(tag),
    },
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  auth: {
    redirect: {
      login: '/', // redirect user when not connected
      callback: '/auth/signed-in'
    },
    strategies: {
      local: false,
      auth0: {
        domain: process.env.AUTH0_DOMAIN,
        client_id: process.env.AUTH0_CLIENT_ID,
        logoutRedirectUri: 'http://localhost:3000',
      }
    }
  },
})

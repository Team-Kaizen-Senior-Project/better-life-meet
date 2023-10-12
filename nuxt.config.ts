// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // ... other options
  modules: ['@pinia/nuxt'],
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
})

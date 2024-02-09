// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	// ... other options
	modules: ['@pinia/nuxt', '@nuxt/ui', '@samk-dev/nuxt-vcalendar','@sidebase/nuxt-auth'],
	// css: ['~/assets/css/main.css'],
	auth:{
		//all pages, aside from the login page will require sign-in- this can be set to false for testing if log in stops working
		globalAppMiddleware: true,
	},
	tailwindcss: {
		cssPath: '~/assets/css/main.css',
	},
	imports: {
		dirs: ['./services'],
	},
	// @ts-ignore
	colorMode: {
		preference: 'light',
	},
	pinia: {
		autoImports: ['defineStore', 'acceptHMRUpdate'],
	},
	devtools: {
		enabled: true,
	},
	vue: {
		compilerOptions: {
			isCustomElement: (tag) => ['inner-column', 'module', 'text-content', 'input-field'].includes(tag),
		},
	},
	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},
	runtimeConfig: {
		FAUNA_KEY: process.env.FAUNA_KEY,
		AUTH_SECRET: process.env.AUTH_SECRET,
		AUTH_ORIGIN: process.env.AUTH_ORIGIN,
	},
    ssr: false, // mediasoup client cannot work with SSR enabled
})

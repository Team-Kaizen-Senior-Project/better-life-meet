// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	// ... other options
	modules: ['@pinia/nuxt', '@nuxt/ui', '@samk-dev/nuxt-vcalendar'],
	css: ['~/assets/css/main.css'],
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
})

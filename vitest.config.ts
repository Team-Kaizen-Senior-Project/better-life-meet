import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
	test: {
		environment: 'happy-dom',
		globals: true,
		coverage: {
			reporter: ['text', 'json-summary', 'json'],
			reportOnFailure: true,
			include: ["components/**"],
			exclude: ["components/ui/**"]
		},
	},
})

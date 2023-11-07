const animate = require('tailwindcss-animate')

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		`./components/**/*.{vue,js,ts}`,
		`./layouts/**/*.vue`,
		`./pages/**/*.vue`,
		`./composables/**/*.{js,ts}`,
		`./plugins/**/*.{js,ts}`,
		`./utils/**/*.{js,ts}`,
		`./App.{js,ts,vue}`,
		`./app.{js,ts,vue}`,
		`./Error.{js,ts,vue}`,
		`./error.{js,ts,vue}`,
		`./app.config.{js,ts}`,
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
		},
	},
	plugins: [animate],
}

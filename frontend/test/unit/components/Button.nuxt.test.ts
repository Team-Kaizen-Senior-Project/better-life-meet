// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Button from '@/components/Button.vue'

describe('Button', () => {
	it('renders as a button with primary style by default', async () => {
		const wrapper = await mountSuspended(Button)
		expect(wrapper.element.tagName).toBe('BUTTON')
		expect(wrapper.classes()).toContain('bg-neutral-600')
	})

	it('renders as a link with secondary style when isLink is true', async () => {
		const wrapper = await mountSuspended(Button, {
			props: {
				isLink: true,
				to: '/about', // example route
				type: 'secondary',
			},
		})
		expect(wrapper.findComponent({ name: 'NuxtLink' }).exists()).toBe(true)
		expect(wrapper.classes()).toContain('bg-green-500')
	})

	it('applies disabled classes when disabled prop is true', async () => {
		const wrapper = await mountSuspended(Button, {
			props: {
				disabled: true,
			},
		})
		expect(wrapper.classes()).toContain('opacity-50')
		expect(wrapper.classes()).toContain('cursor-not-allowed')
	})
})

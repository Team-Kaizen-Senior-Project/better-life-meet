// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import SiteFooter from '@/components/SiteFooter.vue'

describe('SiteFooter', () => {
	it('displays the copyright notice correctly', async () => {
		const wrapper = await mountSuspended(SiteFooter)
		expect(wrapper.text()).toContain('© BetterLife. All rights reserved.')
	})

	it('contains a NuxtLink to the homepage', async () => {
		const wrapper = await mountSuspended(SiteFooter, {
			global: {
				stubs: {
					NuxtLink: true,
					InnerColumn: true,
				},
			},
		})
		const homeLink = wrapper.findComponent({ name: 'NuxtLink' })
		expect(homeLink.exists()).toBe(true)
		expect(homeLink.attributes('href')).toBe('/')
	})
})

import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Dashboard from '@/pages/dashboard.vue'

describe('Dashboard', () => {
	it('Goals display correctly', async () => {
		const wrapper = await mountSuspended(Dashboard)
		const goalsList = wrapper.find('ul')
		expect(goalsList.exists()).toBe(true)
	})

	it('upcoming events display correctly', async () => {
		const wrapper = await mountSuspended(Dashboard)
		const upcomingEvents = wrapper.find('[data-testid="upcoming-events"]')
		expect(upcomingEvents.exists()).toBe(true)
	})

	it('weeks meetings display correctly', async () => {
		const wrapper = await mountSuspended(Dashboard)
		const weeksMeetings = wrapper.find('[data-testid="meetings-this-week"]')
		expect(weeksMeetings.exists()).toBe(true)
	})
})

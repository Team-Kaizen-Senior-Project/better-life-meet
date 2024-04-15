import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import DashboardCustomer from '@/components/DashboardCustomer.vue'

global.navigator.mediaDevices = {
    enumerateDevices: vi.fn().mockResolvedValue([]),
}

describe('DashboardCustomer', () => {
    it('renders DashboardCustomer', async () => {
        const wrapper = await mountSuspended(DashboardCustomer)
        console.log('\x1b[35m%s\x1b[0m', wrapper.html())
        expect(wrapper.exists()).toBe(true)
    })

    it('renders upcoming events', async () => {
        const wrapper = await mountSuspended(DashboardCustomer)
        const upcomingEvents = wrapper.find('[data-testid="upcoming-events"]')
        expect(upcomingEvents.exists()).toBe(true)
    })

    it('renders meetings this week', async () => {
        const wrapper = await mountSuspended(DashboardCustomer)
        const upcomingEvents = wrapper.find('[data-testid="meetings-this-week"]')
        expect(upcomingEvents.exists()).toBe(true)
    })
})
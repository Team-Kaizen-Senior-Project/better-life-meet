import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Dashboard from '@/pages/dashboard.vue'

describe('Dashboard', () => {
    it('Goals display correctly', async () => {
        const wrapper = await mountSuspended(Dashboard)
        const goalsList = wrapper.find('ul')
        expect(goalsList.exists()).toBe(true)
    })
})
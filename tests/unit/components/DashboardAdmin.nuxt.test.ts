import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import DashboardAdmin from '@/components/DashboardAdmin.vue'

vi.mock('@/composables/useApi', () => ({
    useApi: () => ({
        getMeetings: vi.fn().mockResolvedValue([]),
    }),
}))

describe('DashboardAdmin', () => {
    it('renders the dashboard admin', async () => {
        const wrapper = await mountSuspended(DashboardAdmin)
        expect(wrapper.html()).toBeTruthy()
    })

    it('renders the no meetings state', async () => {
        const wrapper = await mountSuspended(DashboardAdmin)
        console.log('\x1b[35m%s\x1b[0m', wrapper.html())
        expect(wrapper.find('[data-testid="no-meetings-found"]').exists()).toBe(true)
    })
})
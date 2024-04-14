// import { describe, it, expect } from 'vitest'
// import { mountSuspended } from '@nuxt/test-utils/runtime'
// import dashboard from '@/pages/dashboard.vue'
// import { nextTick } from 'vue'
//
// vi.mock('@/composables/useCustomerStore', () => ({
//     useCustomerStore: () => ({
//         state: {
//             customer: {
//                 admin: true,
//             },
//         },
//     }),
// }))
//
// vi.mock('@/composables/useMediaStore', () => ({
//     useMediaStoreMock = vi.fn().mockReturnValue({})
// }))
//
// vi.mock('@/components/DashboardAdmin.vue', () => ({
//     render: () => 'Mocked DashboardAdmin Component',
// }))
//
// vi.mock('@/components/DashboardCustomer.vue', () => ({
//     render: () => 'Mocked DashboardCustomer Component',
// }))
//
// describe('Dashboard', () => {
//     console.log('\x1b[35m%s\x1b[0m', "====testing dashboard====")
//     it('renders the DashboardAdmin component for admin users', async () => {
//         const wrapper = await mountSuspended(dashboard)
//         await nextTick()
//         console.log('\x1b[35m%s\x1b[0m', wrapper.html())
//         expect(wrapper.html()).toContain('Mocked DashboardAdmin Component')
//     })
// })
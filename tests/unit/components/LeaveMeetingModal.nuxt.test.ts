import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import LeaveMeetingModal from '@/components/LeaveMeetingModal.vue'
import { nextTick } from 'vue'

describe('LeaveMeetingModal', () => {
    it('renders correctly', async () => {
        const wrapper = await mountSuspended(LeaveMeetingModal)
        expect(wrapper.html()).toMatchSnapshot()
    })

   it('Leave button renders', async () => {
        const wrapper = await mountSuspended(LeaveMeetingModal)
        const leaveButton = wrapper.find('[data-testid="leave-button"]')
        expect(leaveButton.text()).toBe('Leave')
        expect(wrapper.find('[data-testid="leave-button"]').exists()).toBe(true)
    })

    it('opens modal correctly', async () => {
        const wrapper = await mountSuspended(LeaveMeetingModal)
        const leaveButton = wrapper.find('[data-testid="leave-button"]')
        await leaveButton.trigger('click')
        await nextTick()
        expect(wrapper.html()).toMatchSnapshot()
    })
})
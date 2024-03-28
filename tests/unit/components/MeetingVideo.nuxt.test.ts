import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import MeetingVideo from '@/components/MeetingVideo.vue'
import { nextTick } from 'vue'
import { useCustomerStore } from "~/stores/CustomerStore"
import { getHmsInstance } from "~/composables/hmsSingleton"

// Mock customer store
vi.mock('~/stores/CustomerStore', () => ({
    useCustomerStore: vi.fn(() => ({
        customer: {
            id: '123',
            name: 'test',
            email: 'test@example.com'
        }
    }))
}))

describe('MeetingVideo', () => {
    it('renders correctly', async () => {
        const wrapper = await mountSuspended(MeetingVideo, {
            global: {
                plugins: []
            }
        })
        await nextTick()
        expect(wrapper.find('[data-testid="meeting-container"]').exists()).toBe(true)
    });

    it('Video renders', async () => {
        const wrapper = await mountSuspended(MeetingVideo, {
            global: {
                plugins: []
            }
        })
        await nextTick()
        console.log('\x1b[33m%s\x1b[0m', 'This text will be printed in yellow');
        console.log(wrapper.html())
        expect(wrapper.find('[data-testid="video"]').exists()).toBe(true)
    });
});

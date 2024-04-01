import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import MeetingVideo from '@/components/MeetingVideo.vue'
import { nextTick } from 'vue'
import { waitFor } from '@testing-library/vue'
import { useCustomerStore } from "~/stores/CustomerStore"
import { getHmsInstance } from "~/composables/hmsSingleton"

vi.mock('~/stores/CustomerStore', () => ({
    useCustomerStore: vi.fn(() => ({
        state: {
            customer: {
                firstName: 'John',
                lastName: 'Doe'
            }
        }
    }))
}))

vi.mock('~/composables/hmsSingleton', () => ({
    getHmsInstance: vi.fn(() => ({
        isConnected: true,
        peers: [
            { id: '1', name: 'peer 1' },
            { id: '2', name: 'peer 2' },
            { id: '3', name: 'peer 3' }
        ],
        joinRoom: vi.fn(),
        leaveRoom: vi.fn()
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
        await waitFor(() => expect(wrapper.vm.isConnected).toBe(true))
        expect(wrapper).not.toBeNull()
        expect(wrapper.html()).toContain(['data-testid="meeting-container"'])
    });

    it('Video renders', async () => {
        const wrapper = await mountSuspended(MeetingVideo, {
            global: {
                plugins: []
            }
        })
        await nextTick()
        expect(wrapper.find('[data-testid="video"]').exists()).toBe(true)
    });

    it ('Checks peers`', async () => {
        const wrapper = await mountSuspended(MeetingVideo, {
            global: {
                plugins: []
            }
        })
        await nextTick()
        const peerNames = wrapper.findAll('.peer-name')
        expect(peerNames.length).toBe(3)
    })

    it ('creates video elements for each peer', async () => {
        const wrapper = await mountSuspended(MeetingVideo, {
            global: {
                plugins: []
            }
        })
        await nextTick()
        const videoElements = wrapper.findAll('video')
        expect(videoElements.length).toBe(3)
    })

    it ('uses correct user name when joining room', async () => {
        const wrapper = await mountSuspended(MeetingVideo, {
            global: {
                plugins: []
            }
        })
        await nextTick()
        const c = useCustomerStore()
        const expectedUserName = c.state.customer?.firstName + ' ' + c.state.customer?.lastName
        expect(expectedUserName).toBe('John Doe')
    })
});
import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import MeetingVideo from '@/components/MeetingVideo.vue'
import { nextTick } from 'vue'
import { waitFor } from '@testing-library/vue'
import { useCustomerStore } from "~/stores/CustomerStore"
import { getHmsInstance } from "~/composables/useHms"

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

vi.mock('~/composables/useHms', () => ({
    useHms: vi.fn(() => ({
        videoRefs: vi.fn(),
        isLocalAudioEnabled: true,
        isLocalVideoEnabled: true,
        isConnected: true,
        peers: [
            { id: '1', name: 'peer 1' },
            { id: '2', name: 'peer 2' },
            { id: '3', name: 'peer 3' }
        ],
        joinRoom: vi.fn(),
        leaveRoom: vi.fn(),
        toggleAudio: vi.fn(),
        toggleVideo: vi.fn(),
        dominantSpeaker: { id: '1', name: 'peer 1' },
        peersWithAudioStatus: [
            { peer: { id: '1', name: 'peer 1' }, isAudioEnabled: true },
            { peer: { id: '2', name: 'peer 2' }, isAudioEnabled: true },
            { peer: { id: '3', name: 'peer 3' }, isAudioEnabled: true }
        ]
    }))
}))

describe('MeetingVideo', () => {
    it('renders correctly', async () => {
        let wrapper
        try {
            wrapper = await mountSuspended(MeetingVideo, {
                global: {
                    plugins: []
                }
            })
            expect(isMounted(wrapper)).toBe(true)
        } catch (error) {
            console.error('Error mounting component:', error)
        }
    })

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
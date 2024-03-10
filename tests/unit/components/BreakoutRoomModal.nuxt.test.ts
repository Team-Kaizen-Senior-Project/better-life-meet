import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BreakoutRoomModal from '@/components/BreakoutRoomModal.vue'
import { nextTick } from 'vue'

vi.mock('@/stores',()  => ({
    useVideoStore: vi.fn(() => ({
        cameraActive: true,
        modalOpen: true,
        joinMeeting: vi.fn(),
    })),
    useAttendeeStore: () => ({
        createAttendee: vi.fn(),
    }),
    useCustomerStore: () => ({
        state: { customer: { id: 'customer123' } },
    }),
}))

describe('BreakoutRoomModal', () => {
    // TODO: Finish me next sprint
    it('renders the modal', async () => {
        const wrapper = await mountSuspended(BreakoutRoomModal)
        await nextTick()
        expect(wrapper.html()).toMatchSnapshot()
    })
    
})
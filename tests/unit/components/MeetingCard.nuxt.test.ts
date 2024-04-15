import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MeetingCard from '@/components/MeetingCard.vue'
import { nextTick } from 'vue'
import {mountSuspended} from "@nuxt/test-utils/runtime";

describe('MeetingCard', () => {
    it('MeetingCard displays correctly', async () => {
        //mocks
        const useDateMock = vi.fn().mockReturnValue({
            display: vi.fn(),
            displayHours: vi.fn(),
            dayjs: vi.fn(),
        })
        const useApiMock = vi.fn().mockReturnValue({
            deleteMeeting: vi.fn(),
            updateMeeting: vi.fn(),
            getVimeoVideo: vi.fn(),
        })
        const usePodStoreMock = vi.fn().mockReturnValue({
            state: { customerState: {} },
            isLeader: vi.fn(),
        })
        const useCustomerStoreMock = vi.fn().mockReturnValue({
            isAdmin: vi.fn(),
        })
        const useMediaStoreMock = vi.fn().mockReturnValue({})
        const useMeetingCountdownMock = vi.fn().mockReturnValue({
            renderText: vi.fn(),
        })

        const meetingMock = {
            id: '1',
            vimeoId: '123',
            startTime: { isoString: '2022-01-01T00:00:00Z' },
            endTime: { isoString: '2022-01-01T01:00:00Z' },
        }

        const wrapper = mount(MeetingCard, {
            props: {
                meeting: meetingMock,
                isFirst: true,
            },
            global: {
                mocks: {
                    useDate: useDateMock,
                    useApi: useApiMock,
                    usePodStore: usePodStoreMock,
                    useCustomerStore: useCustomerStoreMock,
                    useMediaStore: useMediaStoreMock,
                    useMeetingCountdown: useMeetingCountdownMock,
                },
            },
        })

        await nextTick()

        const podAccountabilityMeeting = wrapper.find('[data-testid="pod-accountability-meeting"]')
        expect(podAccountabilityMeeting.exists()).toBe(true)
    })
})

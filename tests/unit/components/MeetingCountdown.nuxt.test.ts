import { describe, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import MeetingCountdown from '@/components/MeetingCountdown.vue'

describe('MeetingCountdown', () => {
    it('MeetingCountdown displays correctly', async () => {
        const meetingStart = {
            isoString: '2024-03-31T12:00:00Z',
        }

        const wrapper = await mountSuspended(MeetingCountdown, {
            props: {
                meetingStartTime: meetingStart
            }
        })
        const countdown = wrapper.find('[data-testid="countdown"]')
        expect(countdown.exists()).toBe(true)
    })
})

import { describe, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import MeetingCard from '@/components/MeetingCard.vue'

describe('MeetingCard', () => {
	it('MeetingCard displays correctly', async () => {
		const wrapper = await mountSuspended(MeetingCard)
		const podAccountabilityMeeting = wrapper.find('[data-testid="pod-accountability-meeting"]')
		expect(podAccountabilityMeeting.exists()).toBe(true)
	})
})

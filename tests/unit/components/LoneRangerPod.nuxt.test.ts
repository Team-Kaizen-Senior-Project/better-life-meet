import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import LoneRangerPod from '@/components/LoneRangerPod.vue'

describe('LoneRangerPod', () => {
	it('renders correctly', async () => {
		const wrapper = await mountSuspended(LoneRangerPod)
		expect(wrapper.exists()).toBe(true)
		expect(wrapper.text()).toContain('Lone ranger pod')
		const joinButton = wrapper.find('[data-testid="join-button"]')
		expect(joinButton.text()).toBe('Join')
	})
})

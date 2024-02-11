// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import PodHeader from '@/components/PodHeader.vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

describe('PodHeader', async () => {
	const wrapper = await mountSuspended(PodHeader)

	it('displays the correct meeting title', () => {
		expect(wrapper.text()).toContain('Weekly Pod Accountability Meeting')
	})

	it('renders the "View Schedule" button with a ChevronDownIcon', async () => {
		const wrapper = await mountSuspended(PodHeader, {
			global: {
				components: {
					ChevronDownIcon,
				},
			},
		})
		// find the button using the data-testid attribute
		const viewScheduleButton = wrapper.find('[data-testid="view-schedule"]')
		expect(viewScheduleButton.exists()).toBe(true)
		// verify the button text includes "View Schedule"
		expect(viewScheduleButton.text()).toContain('View Schedule')
	})

	it('displays the user information correctly', () => {
		expect(wrapper.text()).toContain('User')
		expect(wrapper.text()).toContain('user@gmail.com')
	})
})

// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import PodView from '@/components/PodView.vue'

describe('PodView', async () => {
	const wrapper = await mountSuspended(PodView)

	it('renders the expected number of buttons', () => {
		const buttons = wrapper.findAll('button')
		expect(buttons.length).toBe(9)
	})

	it('has a "Request to join meeting" button', () => {
		const joinMeetingButton = wrapper.find('button.bg-blue-400')
		expect(joinMeetingButton.text()).toContain('Request to join meeting')
	})
})

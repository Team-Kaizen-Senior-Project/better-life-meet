import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import ScheduleMeetingCard from '~/components/ScheduleMeetingCard.vue'

vi.mock('@/composables/useApi', () => ({
	useApi: () => ({
		createMeeting: vi.fn(() => Promise.resolve()),
	}),
}))

describe('ScheduleMeetingCard', () => {
	it('renders Schedule Meeting', async () => {
		const wrapper = await mount(ScheduleMeetingCard, {
			global: {
				stubs: ['UButton', 'UModal'],
				plugins: [createPinia()],
			},
		})
		expect(wrapper.exists()).toBe(true)
	})

	it('schedule meeting button exists', async () => {
		const wrapper = await mount(ScheduleMeetingCard, {
			global: {
				stubs: ['UButton', 'UModal'],
				plugins: [createPinia()],
			},
		})
		const scheduleMeetingButton = wrapper.find('[data-testid="schedule-meeting-button"]')
		expect(scheduleMeetingButton.exists()).toBe(true)
	})
})

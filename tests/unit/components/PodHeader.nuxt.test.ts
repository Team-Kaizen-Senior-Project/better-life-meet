// @vitest-environment nuxt
import { describe, it, expect, vi } from 'vitest'
import { reactive } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import PodHeader from '@/components/PodHeader.vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

vi.mock('@/stores/CustomerStore', () => ({
	useCustomerStore: () => ({
		state: reactive({
			customer: {
				firstName: 'User',
				email: 'user@gmail.com',
			},
		}),
		getMe: vi.fn(),
	}),
}))

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
		const viewScheduleButton = wrapper.find('[data-testid="view-schedule"]')
		expect(viewScheduleButton.exists()).toBe(true)
		expect(viewScheduleButton.text()).toContain('View Schedule')
	})

	it('displays the user information correctly', async () => {
		expect(wrapper.text()).toContain('User')
		expect(wrapper.text()).toContain('user@gmail.com')
	})
})

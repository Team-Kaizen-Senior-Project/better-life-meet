import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import LeaveMeetingModal from '@/components/LeaveMeetingModal.vue'
import { nextTick } from 'vue'
import { useHms } from "~/composables/useHms"
import { useLeaveModalStore } from "~/stores/LeaveMeetingStore"
import {isConnected} from "happy-dom/lib/PropertySymbol";

vi.mock('~/composables/useHms', () => ({
	useHms: () => ({
		isConnected: true,
		leaveRoom: vi.fn(),
	})
}))

vi.mock('~/stores/LeaveMeetingStore', () => ({
	useLeaveModalStore: () => ({
		isLeaveModalOpen: true,
		toggleLeaveModal: vi.fn(),
	}),
}))

describe('LeaveMeetingModal', () => {
	it('Leave button renders', async () => {
		const wrapper = await mountSuspended(LeaveMeetingModal)
		const leaveButton = wrapper.find('[data-testid="leave-button"]')
		expect(leaveButton.text()).toBe('Leave')
		expect(wrapper.find('[data-testid="leave-button"]').exists()).toBe(true)
	})

	it('opens modal correctly', async () => {
		const wrapper = await mountSuspended(LeaveMeetingModal)
		const leaveButton = wrapper.find('[data-testid="leave-button"]')
		await leaveButton.trigger('click')
		await nextTick()
		expect(wrapper.html()).toMatchSnapshot()
	})
})

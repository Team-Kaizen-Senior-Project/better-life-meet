import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ParticipantIcons from '~/components/ParticipantIcons.vue'

vi.mock('~/composables/useHms', () => ({
	useHms: vi.fn(() => ({
		isConnected: true,
		peers: [
			{ id: '1', name: 'Bob Smith' },
			{ id: '2', name: 'John Doe' },
		],
		peersWithAudioStatus: [
			{ peer: { id: '1', name: 'Bob Smith' }, isAudioEnabled: true },
			{ peer: { id: '2', name: 'John Doe' }, isAudioEnabled: true },
		],
	})),
}))
describe('ParticipantIcons', () => {
	it('renders participant icons correctly', () => {
		const wrapper = mount(ParticipantIcons)
		expect(wrapper.findAll('.participant-icon').length).toBe(2)
	})

	it('applies correct color for participant icon', () => {
		const wrapper = mount(ParticipantIcons)
		const button = wrapper.find('.participant-icon')
		const style = button.attributes('style')
		expect(style).toContain('background-color')
	})

	it('opens popover on button click', async () => {
		const wrapper = mount(ParticipantIcons)
		const button = wrapper.find('.participant-icon')
		await button.trigger('click')
		expect(wrapper.vm.popoverOpen).toBe(true)
	})
})

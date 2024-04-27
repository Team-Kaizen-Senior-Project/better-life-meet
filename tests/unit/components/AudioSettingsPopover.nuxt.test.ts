import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AudioSettingPopover from '~/components/AudioSettingsPopover.vue'
import { CheckIcon, ChevronUpIcon } from '@heroicons/vue/24/outline'

vi.mock('~/components/ui/popover', () => ({
	Popover: {
		template: '<div><slot></slot><slot name="trigger"></slot></div>',
	},
	PopoverContent: {
		template: '<div><slot></slot></div>',
	},
	PopoverTrigger: {
		template: '<div><slot></slot></div>',
	},
}))

vi.mock('@heroicons/vue/24/outline', () => ({
	ChevronUpIcon: {
		template: '<svg class="chevron-up"></svg>',
	},
	CheckIcon: {
		template: '<svg class="check-icon"></svg>',
	},
}))

describe('AudioSettingPopover', () => {
	it('manipulates popover state directly', async () => {
		const wrapper = mount(AudioSettingPopover)
		expect(wrapper.vm.popoverOpen).toBe(false)

		wrapper.vm.popoverOpen = true
		await wrapper.vm.$nextTick()
		expect(wrapper.vm.popoverOpen).toBe(true)

		wrapper.vm.popoverOpen = false
		await wrapper.vm.$nextTick()
		expect(wrapper.vm.popoverOpen).toBe(false)
	})

	it('shows shows select a microphone when popover is open', async () => {
		const wrapper = mount(AudioSettingPopover)
		wrapper.vm.popoverOpen = true
		await wrapper.vm.$nextTick()
		const popoverContent = wrapper.find('.popover-content').text()
		expect(popoverContent).toContain('Select a Microphone')
	})
})

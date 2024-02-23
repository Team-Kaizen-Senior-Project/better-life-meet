// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import MicControls from '@/components/MicControls.vue'

describe('MicControls', () => {
	it('toggles the microphone on and off', async () => {
		const wrapper = await mountSuspended(MicControls, {
			props: { boxLength: 10 },
		})

		expect(wrapper.vm.isTestingMic.value).toBe(false)

		await wrapper.vm.toggleMicTest()
		expect(wrapper.vm.isTestingMic.value).toBe(true)

		await wrapper.vm.toggleMicTest()
		expect(wrapper.vm.isTestingMic.value).toBe(false)
	})
	it('changes the mic icon text when the mic is toggled', async () => {
		const wrapper = await mountSuspended(MicControls, {
			props: { boxLength: 10 },
		})
		
		const testButton = wrapper.find('button')
		expect(testButton.text()).toBe('Test Mic')
		
		await wrapper.vm.toggleMicTest()
		await wrapper.vm.$nextTick()
		expect(testButton.text()).toBe('Stop Test')
		
		await wrapper.vm.toggleMicTest()
		await wrapper.vm.$nextTick()
		expect(testButton.text()).toBe('Test Mic')
	})
	// TODO: Add a test for mic control changes
})

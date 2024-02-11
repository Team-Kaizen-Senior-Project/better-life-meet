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

		// TODO: Add a test to check that the mic icon changes when the mic is toggled

		// TODO: Add a test for mic volume changes
	})
})

// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MicControls from '@/components/MicControls.vue' 

describe('MicControls', () => {
    it('toggles the microphone on and off', async () => {
      const wrapper = mount(MicControls, {
        props: { boxLength: 10 }
      })
  
      expect(wrapper.vm.isTestingMic).toBe(false)
  
      await wrapper.vm.toggleMicTest()
      expect(wrapper.vm.isTestingMic).toBe(true)
  
      await wrapper.vm.toggleMicTest()
      expect(wrapper.vm.isTestingMic).toBe(false)

    // TODO: Add a test to check that the mic icon changes when the mic is toggled

    // TODO: Add a test for mic volume changes
    })
})
  
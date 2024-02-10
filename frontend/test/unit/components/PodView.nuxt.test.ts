// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PodView from '@/components/PodView.vue'

describe('PodView', () => {
  const wrapper = mount(PodView)

  it('renders the expected number of buttons', () => {
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBe(9)
  })

  it('has a "Request to join meeting" button', () => {
    const joinMeetingButton = wrapper.find('button.bg-blue-400')
    expect(joinMeetingButton.text()).toContain('Request to join meeting')
  })
})

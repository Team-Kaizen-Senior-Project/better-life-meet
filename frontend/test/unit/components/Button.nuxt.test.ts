// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '@/components/Button.vue'

describe('Button Component', () => {
  it('renders as a button with primary style by default', () => {
    const wrapper = mount(Button)
    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.classes()).toContain('bg-neutral-600')
  })

  it('renders as a link with secondary style when isLink is true', () => {
    const wrapper = mount(Button, {
      props: {
        isLink: true,
        to: '/about',
        type: 'secondary',
      }
    })
    expect(wrapper.findComponent({ name: 'NuxtLink' }).exists()).toBe(true)
    expect(wrapper.classes()).toContain('bg-green-500')
  })

  it('applies disabled classes when disabled prop is true', () => {
    const wrapper = mount(Button, {
      props: {
        disabled: true,
      }
    })
    expect(wrapper.classes()).toContain('opacity-50')
    expect(wrapper.classes()).toContain('cursor-not-allowed')
  })
})

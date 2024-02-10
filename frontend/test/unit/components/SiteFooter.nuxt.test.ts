// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SiteFooter from '@/components/SiteFooter.vue'

describe('SiteFooter', () => {
  it('displays the copyright notice correctly', () => {
    const wrapper = mount(SiteFooter)
    expect(wrapper.text()).toContain('© BetterLife. All rights reserved.')
  })

  // Test for NuxtLink to home
  it('contains a NuxtLink to the homepage', () => {
    const wrapper = mount(SiteFooter, {
      global: {
        stubs: {
          NuxtLink: true, 
          InnerColumn: true 
        }
      }
    })
    const homeLink = wrapper.findComponent({ name: 'NuxtLink' })
    expect(homeLink.exists()).toBe(true)
    expect(homeLink.attributes('href')).toBe('/')
  })
})

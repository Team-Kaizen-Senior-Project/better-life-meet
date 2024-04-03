import {describe, it, expect, beforeEach, vi} from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Login from '@/pages/login.vue'

describe('Login', () => {
    it('renders Login', async () => {
        const wrapper = await mountSuspended(Login)
        expect(wrapper.exists()).toBe(true)
    })

    it ('email and password fields exist for input', async () => {
        const wrapper = await mountSuspended(Login)
        const email = wrapper.find('[data-testid="email"]')
        const password = wrapper.find('[data-testid="password"]')
        expect(email.exists()).toBe(true)
        expect(password.exists()).toBe(true)
    })

    it('has sign in button', async () => {
        const wrapper = await mountSuspended(Login)
        const button = wrapper.find('[data-testid="sign-in-button"]')
        expect(button.exists()).toBe(true)
    })
})
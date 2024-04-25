import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import MastHead from '~/components/MastHead.vue'

vi.mock('~/composables/useAuth', () => ({
	useAuth: () => ({
		signOut: vi.fn(),
	}),
}))

vi.mock('~/stores/CustomerStore', () => ({
	useCustomerStore: vi.fn(() => ({
		state: {
			customer: {
				firstName: 'Test',
				lastName: 'User',
				email: 'test@example.com',
				admin: false,
			},
		},
	})),
}))

describe('MastHead', () => {
	it('renders customer name and email', () => {
		const wrapper = mount(MastHead)

		const customerName = wrapper.find('.customer-name').text()
		expect(customerName).toContain('Test')

		const customerEmail = wrapper.find('.customer-email').text()
		expect(customerEmail).toContain('test@example.com')
	})

	it('displays user type (admin or regular)', async () => {
		const wrapper = mount(MastHead)
		const customer = useCustomerStore()

		const statusTag = wrapper.find('.font-semibold').text()
		if (customer.state.customer?.admin == true) {
			expect(statusTag).toEqual('Admin')
		} else {
			expect(statusTag).toEqual('Regular User')
		}
	})

	it('should call signOut on button click', async () => {
		const signOutMock = vi.fn()
		const wrapper = mount(MastHead, {
			global: {
				mocks: {
					signOut: signOutMock,
				},
			},
		})

		await wrapper.find('.sign-out').trigger('click')
		expect(signOutMock).toHaveBeenCalled()
	})
})

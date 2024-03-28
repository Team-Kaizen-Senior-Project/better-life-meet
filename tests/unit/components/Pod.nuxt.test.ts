import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Pod from '@/components/Pod.vue'

describe('Pod', () => {
	it('renders the pod number correctly', async () => {
		const podNumber = 'Pod 1'
		const wrapper = await mountSuspended(Pod, {
			props: { podNumber, joinText: '' },
		})
		expect(wrapper.text()).toContain(podNumber)
	})

	it('conditionally renders the join button based on joinText prop', async () => {
		const wrapperWithJoinText = await mountSuspended(Pod, {
			props: { podNumber: 'Pod 1', joinText: 'Join this pod' },
		})
		const wrapperWithoutJoinText = await mountSuspended(Pod, {
			props: { podNumber: 'Pod 1', joinText: '' },
		})

		expect(wrapperWithJoinText.find('button').exists()).toBe(true)
		expect(wrapperWithoutJoinText.find('button').exists()).toBe(false)
	})
})

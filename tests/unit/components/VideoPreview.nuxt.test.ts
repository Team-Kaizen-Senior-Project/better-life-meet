import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import VideoPreview from '@/components/VideoPreview.vue'

vi.mock('navigator.mediaDevices.getUserMedia', () => {
	return Promise.resolve({
		getTracks: () => [{ stop: vi.fn() }],
	})
})

describe('VideoPreview', () => {
	it('renders correctly based on cameraActive prop', async () => {
		const wrapper = await mountSuspended(VideoPreview, {
			props: {
				cameraActive: true,
			},
		})
		expect(wrapper.find('video').exists()).toBe(true)
	})

	it('attempts to assign stream to video when cameraActive is true', async () => {
		const originalNavigator = global.navigator

		const mockGetUserMedia = vi.fn(() =>
			Promise.resolve({
				getTracks: () => [{ stop: vi.fn() }],
			}),
		)

		// type assertion to avoid TS error
		Object.defineProperty(global.navigator, 'mediaDevices', {
			value: {
				getUserMedia: mockGetUserMedia,
				enumerateDevices: vi.fn(),
				getDisplayMedia: vi.fn(),
				getSupportedConstraints: vi.fn(),
			},
			writable: true,
		})

		const wrapper = await mountSuspended(VideoPreview, {
			props: {
				cameraActive: true,
			},
		})

		// wait for asynchronous operations to complete
		await wrapper.vm.$nextTick()

		// check getUserMedia was called --  attempt to assign the stream happened
		expect(mockGetUserMedia).toHaveBeenCalled()

		// restore
		global.navigator = originalNavigator
	})
})

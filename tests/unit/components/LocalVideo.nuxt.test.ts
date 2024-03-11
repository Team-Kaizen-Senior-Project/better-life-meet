import { describe, it, beforeEach, afterEach, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import LocalVideo from '@/components/LocalVideo.vue'

describe('LocalVideo with video disabled', () => {
	beforeEach(() => {
		vi.mock('@/stores/MediaStore', () => ({
			useMediaStore: () => ({
				stream: undefined,
				isVideoEnabled: false,
			}),
		}))
	})

	afterEach(() => {
		vi.resetAllMocks()
	})

	it('shows VideoCameraSlashIcon when video is not enabled', async () => {
		const wrapper = await mountSuspended(LocalVideo)
		console.log(wrapper.html())
		expect(wrapper.find('svg').exists()).toBe(true)
	})

	it('displays fallback UI when the stream is not available', async () => {
		const wrapper = await mountSuspended(LocalVideo)
		expect(wrapper.find('video').exists()).toBe(false)
		expect(wrapper.find('svg').exists()).toBe(true)
	})
})

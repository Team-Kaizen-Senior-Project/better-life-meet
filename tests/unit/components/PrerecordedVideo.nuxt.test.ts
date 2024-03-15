import { describe, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import PrerecordedVideo from '@/components/PrerecordedVideo.vue'

describe('PrerecordedVideo.vue', () => {
	it('renders the video element with the correct attributes', async () => {
		const wrapper = await mountSuspended(PrerecordedVideo)
		const video = wrapper.find('video')
		expect(video.exists()).toBe(true)
		expect(video.attributes('controls')).toBeDefined()
		expect(video.attributes('playsinline')).toBe('true')
		expect(video.attributes('src')).toBe('/assets/a.mp4')
	})

	it('emits "toggleVideo" when the video has ended', async () => {
		const wrapper = await mountSuspended(PrerecordedVideo)
		const video = wrapper.find('video')
		await video.trigger('ended')
		expect(wrapper.emitted('toggleVideo')).toBeTruthy()
	})
})

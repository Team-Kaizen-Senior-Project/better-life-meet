import { describe, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import PrerecordedVideo from '@/components/PrerecordedVideo.vue'

describe('PrerecordedVideo', () => {
	it('renders the video element with the correct attributes', async () => {
		const wrapper = await mountSuspended(PrerecordedVideo, {
			props: {
				meetingStartTime: { isoString: new Date().toISOString() }
			}
		})

		const video = wrapper.find('video')
		expect(video.exists()).toBe(true)
		expect(video.attributes('controls')).toBeDefined()
		expect(video.attributes('playsinline')).toBe('true')
		expect(video.attributes('src')).toBe('/assets/a.mp4')
	})

	it('emits "toggleVideo" when the video has ended', async () => {
		const wrapper = await mountSuspended(PrerecordedVideo, {
			props: {
				meetingStartTime: { isoString: new Date().toISOString() }
			}
		})
		const video = wrapper.find('video')
		await video.trigger('ended')
		expect(wrapper.emitted('toggleVideo')).toBeTruthy()
	})

	it ('emits toggleVideo event when user is too late to watch the video', async () => {
		const wrapper = await mountSuspended(PrerecordedVideo, {
			props: {
				meetingStartTime: { isoString: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() } // 24 hours ago
			}
		})

		const video = wrapper.find('video')
		await video.trigger('ended')
		await wrapper.vm.$nextTick()
		expect(wrapper.emitted().toggleVideo).toBeTruthy()
	})
})

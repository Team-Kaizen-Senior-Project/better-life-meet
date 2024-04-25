import { describe, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import PrerecordedVideo from '@/components/PrerecordedVideo.vue'

describe('PrerecordedVideo', () => {
	it('renders the video element with the correct attributes', async () => {
		const wrapper = await mountSuspended(PrerecordedVideo, {
			props: {
				video: {
					download: [
						{},
						{
							link: './a.mp4',
						},
					],
				},
			},
		})
		const video = wrapper.find('video')
		expect(video.exists()).toBe(true)
		expect(video.attributes('controls')).toBeDefined()
		expect(video.attributes('playsinline')).toBe('true')
		expect(video.attributes('src')).toBe('./a.mp4#t=0')
	})

	it('emits "toggleVideo" when the video has ended', async () => {
		const wrapper = await mountSuspended(PrerecordedVideo, {
			props: {
				video: {
					download: [
						{},
						{
							link: './a.mp4',
						},
					],
				},
			},
		})
		const video = wrapper.find('video')
		await video.trigger('ended')
		expect(wrapper.emitted('toggleVideo')).toBeTruthy()
	})

	it('emits toggleVideo event when user is too late to watch the video', async () => {
		const wrapper = await mountSuspended(PrerecordedVideo, {
			props: {
				video: {
					download: [
						{},
						{
							link: './a.mp4',
						},
					],
				},
			},
		})

		const video = wrapper.find('video')
		await video.trigger('ended')
		await wrapper.vm.$nextTick()
		expect(wrapper.emitted().toggleVideo).toBeTruthy()
	})
})

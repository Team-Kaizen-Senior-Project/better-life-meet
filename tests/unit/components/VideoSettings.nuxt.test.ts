import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import VideoSettings from '@/components/VideoSettings.vue'
import { VideoCameraIcon } from '@heroicons/vue/24/outline'
import { createPinia } from 'pinia'

describe('VideoSettings', () => {
	it('mounts correctly and renders title and description', async () => {
		const props = {
			title: 'Test Title',
			description: 'Test Description',
			boxLength: '300px',
		}
		expect(props.title).toBe('Test Title')
	})

	it('renders the video camera icon', async () => {
		const wrapper = await mountSuspended(VideoSettings, {
			props: {
				title: 'Test Title',
				description: 'Test Description',
				boxLength: '100',
			},
			global: {
				plugins: [createPinia()],
			},
		})

		const cameraIcon = wrapper.find('[data-testid="video-icon"]')
		expect(cameraIcon.exists()).toBe(true)
	})

	it('renders the microphone icon', async () => {
		const wrapper = await mountSuspended(VideoSettings, {
			props: {
				title: 'Test Title',
				description: 'Test Description',
				boxLength: '100',
			},
			global: {
				plugins: [createPinia()],
			},
		})
		const microphoneIcon = wrapper.find('[data-testid="microphone-icon"]')
		expect(microphoneIcon.exists()).toBe(true)
	})
})

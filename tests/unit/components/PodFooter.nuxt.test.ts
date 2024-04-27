import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PodFooter from '~/components/PodFooter.vue'
import { MicrophoneIcon, VideoCameraIcon, VideoCameraSlashIcon } from '@heroicons/vue/24/outline'
import { HMSNotificationTypes } from '@100mslive/hms-video-store'
import LeaveMeetingModal from '~/components/LeaveMeetingModal.vue'

// Mock the stores and hooks
vi.mock('~/composables/useMediaStore', () => ({
	useMediaStore: () => ({
		state: {
			isAudioEnabled: true,
			isVideoEnabled: true,
		},
		toggleAudio: vi.fn(),
		toggleVideo: vi.fn(),
	}),
}))

vi.mock('~/composables/useChatboxStore', () => ({
	useChatboxStore: () => ({
		isChatBoxVisible: false,
		toggleChatBox: vi.fn(),
	}),
}))

vi.mock('~/composables/useHms', () => ({
	useHms: () => ({
		isConnected: true,
		toggleAudio: vi.fn(),
		toggleVideo: vi.fn(),
		hmsNotifications: {
			onNotification: vi.fn((callback) =>
				callback({ type: HMSNotificationTypes.NEW_MESSAGE, data: { message: 'Hello', senderName: 'User1' } }),
			),
		},
	}),
}))

describe('PodFooter', () => {
	it('renders microphone and video icons based on media state', () => {
		const wrapper = mount(PodFooter)
		const audioIcon = wrapper.findComponent(MicrophoneIcon)
		const videoIcon = wrapper.findComponent(VideoCameraIcon)

		expect(audioIcon.exists()).toBe(true)
		expect(videoIcon.exists()).toBe(true)
	})

	it('toggles microphone and video when buttons are clicked', async () => {
		const wrapper = mount(PodFooter)
		const toggleAudioButton = wrapper.find('button:first-child')
		const toggleVideoButton = wrapper.findAll('button')[1]

		await toggleAudioButton.trigger('click')
		await toggleVideoButton.trigger('click')

		expect(wrapper.vm.toggleAudio).toHaveBeenCalled()
		expect(wrapper.vm.toggleVideo).toHaveBeenCalled()
	})

	it('handles chat box visibility', async () => {
		const wrapper = mount(PodFooter)
		const chatToggleButton = wrapper.find('.toggle-chat')

		await chatToggleButton.trigger('click')
		expect(wrapper.vm.isChatBoxVisible).toBe(true)
	})

	it('renders leave button when connected', () => {
		const wrapper = mount(PodFooter)
		const leaveButton = wrapper.findComponent(LeaveMeetingModal)
		expect(leaveButton.exists()).toBe(true)
	})
})

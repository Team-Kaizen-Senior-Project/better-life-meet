import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ChatBox from '~/components/ChatBox.vue'
import { ref } from 'vue'

vi.mock('~/composables/useHms', () => ({
	useHms: () => ({
		messages: ref([{ id: 1, sendername: 'Test User', time: new Date(), content: 'test message' }]),
		sendBroadcastMessage: vi.fn(),
	}),
}))

vi.mock('~/stores/useCustomerStore', () => {
	return {
		state: ref({
			customer: { firstName: 'Test', lastName: 'User' },
		}),
		isAdmin: ref(false),
	}
})

vi.mock('~/stores/useChatboxStore', () => {
	const isChatBoxVisible = ref(false)
	return {
		isChatBoxVisible,
		toggleChatBox: () => {
			isChatBoxVisible.value = !isChatBoxVisible.value
		},
	}
})

vi.mock('vue-router', () => ({
	useRoute: () => ({
		params: { id: 'test-meeting-id' },
	}),
}))

describe('ChatBox tests', () => {
	it('renders correctly when visible', async () => {
		const { toggleChatBox } = useChatboxStore()
		toggleChatBox() // Make sure the chatbox is visible
		const wrapper = await mountSuspended(ChatBox)
		await nextTick()
		expect(wrapper.isVisible()).toBe(true)
		expect(wrapper.find('[data-testid="meeting-chat"]').exists()).toBe(true)
	})

	it('renders messages correctly', async () => {
		const wrapper = await mountSuspended(ChatBox)
		await nextTick()
		const messages = wrapper.findAll('.messageText')
		expect(messages.length).toBe(1)
		expect(messages[0].text()).toContain('Test User')
		expect(messages[0].text()).toContain('test message')
	})

	it('sends a message on button click', async () => {
		const wrapper = await mountSuspended(ChatBox)
		await nextTick()
		const messageInput = wrapper.find('textarea')
		messageInput.setValue('Hello, world!')
		const sendButton = wrapper.find('[data-testid="send-button"]')
		await sendButton.trigger('click')
		await nextTick()
		expect(wrapper.vm.sendBroadcastMessage).toHaveBeenCalledWith('Hello, world!')
	})
})

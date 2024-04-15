import { describe, it, expect, vi } from "vitest"
import { mountSuspended } from "@nuxt/test-utils/runtime"
import ChatBox from "@/components/ChatBox.vue"
import { ref, computed} from 'vue'

vi.mock('~/composables/useHms', () => ({
  useHms: () => ({
    messages: ref([{id: 1, sendername: 'Test User', time: new Date(), content: 'test message'}]),
    sendBroadcastMessage: vi.fn(),
  }),
}))

vi.mock('~/stores/useCustomerStore', () => {
  const state = ref({
    customer: { firstName: 'Test', lastName: 'User' },
  })
  const currentUser = computed(() => {
    return `${state.value.customer.firstName} ${state.value.customer.lastName}`
  })
  return {
    state,
    getMe: async () => state.value.customer,
    isAdmin: computed(() => false),
  }
})

vi.mock('~/stores/useChatboxStore', () => {
  const isChatBoxVisible = ref(false)
  const messages = ref([{id: 1, sendername: 'Test User', time: new Date(), content: 'Meeting Chat'}])
  return {
    state: computed(() => ({ isChatBoxVisible })),
    actions: {
      toggleChatBox: () => {
        isChatBoxVisible.value = !isChatBoxVisible.value
      },
    },
  }
})

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { id: 'test-meeting-id' },
  }),
}))

describe("ChatBox tests", async () => {
  it("chatbox renders correctly", async () => {
    const wrapper = await mountSuspended(ChatBox)
    await nextTick()
    expect(wrapper).toBeTruthy()

    //TODO: test meeting chat test
  })
})
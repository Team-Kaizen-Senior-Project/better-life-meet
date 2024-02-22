import { describe, it, expect, vi } from "vitest"
import { mountSuspended } from "@nuxt/test-utils/runtime"
import VideoPreview from "@/components/VideoPreview.vue"

vi.mock('navigator.mediaDevices.getUserMedia', () => {
    return Promise.resolve({
        getTracks: () => [{ stop: vi.fn() }]
    })
})

describe("VideoPreview", () => {
    it('renders correctly based on cameraActive prop', async () => {
        const wrapper = await mountSuspended(VideoPreview, {
            props: {
                cameraActive: true
            }
        })
        expect(wrapper.find('video').exists()).toBe(true)
    })

    it('assigns stream to video when cameraActive is true', async () => {
        // TODO: FINISH ME 
    })
})
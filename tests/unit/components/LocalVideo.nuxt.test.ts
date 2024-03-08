import { describe, it, beforeEach, afterEach, vi } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import LocalVideo from "@/components/LocalVideo.vue";

// global.MediaStream = vi.fn().mockImplementation(() => ({
//     getVideoTracks: vi.fn(() => [{ stop: vi.fn() }]),
//     getAudioTracks: vi.fn(() => [{ stop: vi.fn() }]),
// }))

describe("LocalVideo with video disabled", () => {
    beforeEach(() => {
        // Set up for the tests where the video is disabled
        vi.mock("@/stores/MediaStore", () => ({
            useMediaStore: () => ({
                stream: undefined,
                isVideoEnabled: false,
            }),
        }))
    })

    afterEach(() => {
        // Reset any mocks or test-specific configurations
        vi.resetAllMocks();
    })

    it('shows VideoCameraSlashIcon when video is not enabled', async () => {
        const wrapper = await mountSuspended(LocalVideo);
        console.log(wrapper.html());
        expect(wrapper.find('svg').exists()).toBe(true);
    })

    it('displays fallback UI when the stream is not available', async () => {
        const wrapper = await mountSuspended(LocalVideo);
        expect(wrapper.find('video').exists()).toBe(false);
        expect(wrapper.find('svg').exists()).toBe(true);
    })
})

// describe("LocalVideo with video enabled", () => {
//     beforeEach(() => {
//         vi.mock("@/stores/MediaStore", () => ({
//             useMediaStore: () => ({
//                 stream: new MediaStream(),
//                 isVideoEnabled: true,
//             }),
//         }))
//     })

//     afterEach(() => {
//         vi.resetAllMocks();
//     })

//     it('displays the video stream when it is available', async () => {
//         const wrapper = await mountSuspended(LocalVideo);
//         expect(wrapper.find('video').exists()).toBe(true);
//         expect(wrapper.find('svg').exists()).toBe(false);
//     })
// })

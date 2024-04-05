interface State {
	viewedVideos: string[]
}

export const useMeetingStore = defineStore(
	'meeting',
	() => {
		const state = reactive<State>({
			viewedVideos: [],
		})

		function getHasViewedVideo(id: string) {
			return !!state.viewedVideos.find((meetingId) => {
				return meetingId === id
			})
		}

		function viewVideo(id: string) {
			state.viewedVideos.push(id)
		}

		function removeViewVideo(id: string) {
			state.viewedVideos = state.viewedVideos.filter((meetingId) => {
				return meetingId === id
			})
		}

		return { state, getHasViewedVideo, viewVideo, removeViewVideo }
	},
	{
		persist: {
			paths: ['state.viewedVideos'],
			storage: persistedState.localStorage,
		},
	},
)

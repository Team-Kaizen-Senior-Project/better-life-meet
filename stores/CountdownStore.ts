export const useCountdownStore = defineStore('countdown', () => {
	const showCountdown: Ref<boolean> = ref(false)

	function setShowCountdown(value: boolean) {
		showCountdown.value = value
	}

	return { showCountdown, setShowCountdown }
})

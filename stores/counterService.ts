export const useCounterService = defineStore('counter', () => {
	const count = ref(0)

	function increment() {
		count.value++
	}

	function decrement() {
		count.value--
	}

	function reset() {
		count.value = 0
	}

	return { count, increment, decrement, reset }
})

export const useHabitStore = defineStore('habits', () => {
	const habits = ref([
		{ id: 1, text: 'This is habit item number one' },
		{ id: 2, text: "Number 2 item that I'm trying to achieve for this week" },
		{ id: 3, text: 'The one above is 2 lines long' },
		{ id: 4, text: 'Since some habits can be wordy' },
	])

	function addHabit() {
		const newId = habits.value.length + 1
		habits.value.push({ id: newId, text: 'Enter New Habit Text' })
	}

	function removeHabit(id) {
		habits.value = habits.value.filter((habit) => habit.id !== id)
	}

	function saveHabits() {
		//TODO save the habit in db
	}

	return { habits, addHabit, removeHabit, saveHabits }
})

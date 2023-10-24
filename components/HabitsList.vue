<script setup>
const habits = useHabitStore();

</script>
<template>
    <div class="p-6 max-w-lg max-h-lg mx-auto bg-gray-900 rounded-lg">
        <h1 class="text-2xl font-bold text-white mb-4">Your habits for this week</h1>
        <ul>
            <li v-for="habit in habits.habits" :key="habit.id" class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-2">
                    <span class="text-xl">✏️</span>
                    <p class="bg-white rounded-lg p-2">{{ habit.text }}</p>
                </div>
                <button @click="removeHabit(habit.id)" class="bg-red-500 rounded-full p-2 text-white">❌</button>
            </li>
        </ul>
        <button @click="habits.addHabit()" class="bg-blue-500 mt-4 p-2 w-full rounded-lg text-white">Add Habit ➕</button>
        <button @click="habits.saveHabits()" class="bg-green-500 mt-4 p-2 w-full rounded-lg text-white">Save</button>
    </div>
</template>
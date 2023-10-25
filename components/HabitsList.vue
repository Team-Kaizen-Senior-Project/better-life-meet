<script setup>
import { ref } from 'vue'

const habits = useHabitStore();

let editMode = ref(false)

function setEditMode(mode) {
    console.log(editMode)
    editMode = mode
}

</script>
<template>
    <div class="p-6 max-w-lg max-h-lg mx-auto bg-gray-900 rounded-lg">
        <div class="flex align-center ">
            <h1 class="text-2xl font-bold text-white mb-4">Your habits for this week</h1>
            <button class="text-white text-xl align-center" @click="setEditMode(true)">Edit</button>
        </div>
        <ul v-if="editMode">
            <li v-for="habit in habits.habits" :key="habit.id" class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-2">
                    <span class="text-xl">✏️</span>
                    <p class="bg-white rounded-lg p-2">{{ habit.text }}</p>
                </div>
                <button @click="habits.removeHabit(habit.id)" class="bg-red-500 rounded-full p-2 text-white">❌</button>
            </li>
        </ul>
        <ul v-else>
            <li v-for="habit in habits.habits" :key="habit.id" class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-2">
                    <p class="p-2 text-white font-semi-bold">{{ habit.text }}</p>
                </div>
            </li>
        </ul>
        <button @click="habits.addHabit()" class="bg-blue-500 mt-4 p-2 w-full rounded-lg text-white">Add Habit ➕</button>
        <button @click="habits.saveHabits()" class="bg-green-500 mt-4 p-2 w-full rounded-lg text-white">Save</button>
    </div>
</template>
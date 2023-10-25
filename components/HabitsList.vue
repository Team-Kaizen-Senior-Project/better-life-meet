<script setup>
import { ref } from 'vue'
import { PencilSquareIcon } from '@heroicons/vue/24/solid'
import { PencilIcon } from '@heroicons/vue/24/solid'
import { PlusCircleIcon } from '@heroicons/vue/24/solid'
import { BackspaceIcon } from '@heroicons/vue/24/solid'

const habits = useHabitStore();

let editMode = ref(false)

function toggleEditMode() {
    editMode.value = !editMode.value;
}
function handleSave() {
    toggleEditMode()
    habits.saveHabits()
}

</script>
<template>
    <div class="p-6 max-w-lg max-h-lg mx-auto bg-gray-900 border-2 border-dashed border-white">
        <div v-if="editMode">
            <h1 class="text-2xl font-semibold text-white mb-4">Your habits for this week</h1>
            <ul>
                <li v-for="habit in habits.habits" :key="habit.id" class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3 w-full">
                        <PencilIcon class="h-9 w-9 text-gray-800 bg-white p-2 rounded" />
                        <input class=" bg-white rounded-lg p-2 w-full" v-model="habit.text" />
                        <BackspaceIcon @click="habits.removeHabit(habit.id)"
                            class="h-9 w-9 text-white bg-red-500 p-2 rounded" />
                    </div>
                </li>
            </ul>
            <div class="flex justify-between">
                <button @click="habits.addHabit()"
                    class="bg-blue-500 mt-4 py-2 px-3 rounded-3xl text-white flex justify-center align-center">Add Habit
                    <PlusCircleIcon class="h-7 w-7 pl-1" />
                </button>
                <button @click="handleSave" class="bg-green-500 mt-4 px-3 py-2 rounded-lg text-white">Save</button>
            </div>
        </div>
        <div v-else>
            <div class="flex align-center justify-between">
                <h1 class="text-2xl font-bold text-white mb-4">Your habits for this week</h1>
                <PencilSquareIcon @click="toggleEditMode" class="h-9 w-9 text-gray-800 bg-white p-2 rounded" />
            </div>
            <ul>
                <li v-for="habit in habits.habits" :key="habit.id" class="flex items-center justify-between mb-4">
                    <div class="flex items-center space-x-2">
                        <p class="p-2 text-white font-semi-bold">{{ habit.text }}</p>
                    </div>
                </li>
            </ul>

        </div>
    </div>
</template>
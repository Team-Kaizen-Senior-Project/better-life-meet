<script setup>
import { ref } from 'vue'
import { PencilSquareIcon } from '@heroicons/vue/24/solid'
import { PencilIcon } from '@heroicons/vue/24/solid'
import { PlusCircleIcon } from '@heroicons/vue/24/solid'
import { BackspaceIcon } from '@heroicons/vue/24/solid'

const habits = useHabitStore()

let editMode = ref(false)

function toggleEditMode() {
	editMode.value = !editMode.value
}
function handleSave() {
	toggleEditMode()
	habits.saveHabits()
}
</script>
<template>
	<div class="border border-dashed border-zinc-500 p-4">
		<div v-if="editMode">
			<h1 class="mb-4 text-base font-medium text-white">Your habits for this week</h1>
			<ul>
				<li v-for="habit in habits.habits" :key="habit.id" class="mb-4 flex items-center justify-between">
					<div class="flex w-full items-center gap-3">
						<input class="w-full rounded-lg bg-gray-700 p-2" v-model="habit.text" />
						<BackspaceIcon @click="habits.removeHabit(habit.id)"
							class="h-9 w-9 rounded bg-red-500 p-2 text-white" />
					</div>
				</li>
			</ul>
			<div class="flex justify-between">
				<UButton @click="habits.addHabit()" class="bg-sky-500 p-2 hover:bg-sky-600">
					Add Habit
					<PlusCircleIcon class="h-5 w-5" />
				</UButton>
				<UButton @click="handleSave" class="bg-green-500 px-2 py-1 text-white">
					Save
				</UButton>
			</div>
		</div>
		<div v-else>
			<div class="align-center flex justify-between">
				<h1 class="mb-4 text-lg font-medium text-white">Your habits for this week</h1>
				<PencilSquareIcon @click="toggleEditMode" class="h-9 w-9 rounded bg-white p-2 text-gray-800" />
			</div>
			<ul class="grid gap-2">
				<li v-for="habit in habits.habits" :key="habit.id">
					{{ habit.text }}
				</li>
			</ul>
		</div>
	</div>
</template>

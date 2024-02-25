<script setup>
	import { ref } from 'vue'
	import { PencilSquareIcon } from '@heroicons/vue/24/solid'
	import { PencilIcon } from '@heroicons/vue/24/solid'
	import { PlusCircleIcon } from '@heroicons/vue/24/outline'
	import { XCircleIcon } from '@heroicons/vue/24/outline'

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
	<div class="rounded-lg bg-zinc-900 p-4">
		<div v-if="editMode">
			<h1 class="mb-4 text-lg font-medium text-white">Your habits for this week</h1>
			<ul>
				<li v-for="habit in habits.habits" :key="habit.id" class="mb-4 flex items-center justify-between">
					<div class="flex w-full items-center gap-2">
						<XCircleIcon
							@click="habits.removeHabit(habit.id)"
							class="h-5 w-5 rounded text-red-500 hover:cursor-pointer"
							data-testid="remove-habit-button"
						/>
						<input
							class="min-w-0 flex-auto appearance-none rounded-md border border-zinc-700 border-zinc-900/10 bg-zinc-700 px-3 py-[calc(theme(spacing.2)-1px)] text-zinc-200 shadow-md shadow-zinc-800/5 placeholder:text-zinc-500 focus:border-teal-400 focus:outline-none focus:ring-4 focus:ring-teal-400/10 sm:text-sm"
							v-model="habit.text"
						/>
					</div>
				</li>
			</ul>
			<div class="flex justify-between">
				<UButton data-testid="add-habit-button" @click="habits.addHabit()" class="bg-zinc-700 text-xs font-medium hover:bg-zinc-700/60">
					<PlusCircleIcon class="h-5 w-5" />
					Add Habit
				</UButton>
				<UButton @click="handleSave" class="bg-sky-500 text-xs font-medium text-white hover:bg-sky-600">Save</UButton>
			</div>
		</div>
		<div v-else>
			<div class="align-center flex justify-between">
				<h1 class="mb-4 text-lg font-medium text-white">Your habits for this week</h1>
			</div>
			<ul class="grid gap-2 pl-4">
				<li v-for="habit in habits.habits" :key="habit.id" class="list-disc text-sm">
					{{ habit.text }}
				</li>
			</ul>
			<div>
				<UButton data-testid ="edit-button" @click="toggleEditMode" class="mt-4 bg-zinc-700 text-xs font-medium hover:bg-zinc-700/60">
					Edit habits
				</UButton>
			</div>
		</div>
	</div>
</template>

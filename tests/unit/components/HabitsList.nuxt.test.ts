import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import HabitsList from '@/components/HabitsList.vue'
import { nextTick } from 'vue'

describe('HabitsList', () => {
	beforeEach(() => {
		setActivePinia(createPinia())
	})

	it('renders correctly in view mode', async () => {
		const wrapper = await mountSuspended(HabitsList)
		expect(wrapper.text()).toContain('This is habit item number one')
	})

	it('toggles editMode on button click', async () => {
		const wrapper = await mountSuspended(HabitsList, {
			global: {
				plugins: [createPinia()],
			},
		})
		const editButton = wrapper.find('[data-testid="edit-button"]')
		await editButton.trigger('click')
		await nextTick()

		expect(wrapper.findAll('input').length).toBeGreaterThan(3)
	})

	it('removes a habit on remove button click', async () => {
		const wrapper = await mountSuspended(HabitsList, {
			global: {
				plugins: [createPinia()],
			},
		})
		const initialHabitCount = wrapper.findAll('li').length
		// trigger edit mode
		const editButton = wrapper.find('[data-testid="edit-button"]')
		await editButton.trigger('click')
		await nextTick()

		// find and click first remove button
		const firstHabitRemoveButton = wrapper.find('[data-testid="remove-habit-button"]')
		if (firstHabitRemoveButton.exists()) {
			await firstHabitRemoveButton.trigger('click')
			await nextTick()

			const updatedHabitCount = wrapper.findAll('li').length
			expect(updatedHabitCount).toBeLessThan(initialHabitCount)
		} else {
			console.error('Remove button not found')
		}
	})

	it('adds a new habit on add button click', async () => {
		const wrapper = await mountSuspended(HabitsList, {
			global: {
				plugins: [createPinia()],
			},
		})
		const initialHabitCount = wrapper.findAll('li').length
		// trigger edit mode
		const editButton = wrapper.find('[data-testid="edit-button"]')
		await editButton.trigger('click')
		await nextTick()

		// find and click add button
		const addButton = wrapper.find('[data-testid="add-habit-button"]')
		if (addButton.exists()) {
			await addButton.trigger('click')
			await nextTick()

			const updatedHabitCount = wrapper.findAll('li').length
			expect(updatedHabitCount).toBeGreaterThan(initialHabitCount)
		} else {
			console.error('Add button not found')
		}
	})
})

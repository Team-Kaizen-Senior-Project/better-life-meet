import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import HabitsList from '@/components/HabitsList.vue'
import { nextTick } from 'vue'

console.log('\x1b[94m%s\x1b[0m', '-'.repeat(100))
console.log('\x1b[94m%s\x1b[0m', '-'.repeat(100))
console.log('\x1b[94m%s\x1b[0m', '-'.repeat(100))

describe('HabitsList', () => {
    beforeEach(() => {
        // reset pinia state before each test to avoid state leakage
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
})

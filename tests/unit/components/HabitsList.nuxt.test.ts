import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import HabitsList from '@/components/HabitsList.vue'

import { ref } from 'vue'

// vi.mock('@/store/habitService.js', () => ({
//     useHabitStore: () => ({
//         habits: ref([{ id: 1, text: 'test' }]),
//         saveHabits: vi.fn(),
//         addHabit: vi.fn(),
//         removeHabit: vi.fn(),
//     }),
// }))

describe('HabitsList', () => {
    it('renders correctly in view mode', async () => {
        const wrapper = await mountSuspended(HabitsList)
        console.log('\x1b[94m%s\x1b[0m', '-'.repeat(100))
        console.log(wrapper.text())
        expect(wrapper.text()).toContain('This is habit item number one')
    })
})
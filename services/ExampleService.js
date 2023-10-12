import { ref } from 'vue'

const name = ref('John Doe')

export function setName(newName) {
  name.value = newName
}

export { name }

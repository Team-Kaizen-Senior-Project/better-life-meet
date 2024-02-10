// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'

import { test } from 'vitest'

test('my test', () => {
  // ... test with Nuxt environment!
})

// Quick test to see if the environment is working
describe('Vitest environment test - Hello World', () => {
    it('should pass', () => {
      const message = 'Hello, world!'
      expect(message).toBe('Hello, world!')
    })
  })
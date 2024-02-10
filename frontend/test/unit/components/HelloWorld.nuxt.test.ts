// @vitest-environment nuxt
import { describe, it, expect, test } from 'vitest'

test('my test', () => {
  // ... test with Nuxt environment!
})

describe('Vitest environment test - Hello World', () => {
    it('should pass', () => {
      const message = 'Hello, world!'
      expect(message).toBe('Hello, world!')
    })
  })
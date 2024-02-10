/**
 * This is a test file to ensure that the vitest environment is working with Nuxt.
 * This file is not testing any specific component or functionality, but is simply
 * a test to ensure that the vitest environment is working with Nuxt.
 * 
 * Questions? Consult: https://nuxt.com/docs/getting-started/testing#setup
 */
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
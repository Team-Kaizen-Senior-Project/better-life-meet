import { setupServer } from 'msw/node'
import { handlers } from './mocks/Handlers'

export const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

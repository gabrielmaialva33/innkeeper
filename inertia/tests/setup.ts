import '@testing-library/jest-dom/vitest'
import { server } from './mocks/server'
import { QueryClient } from '@tanstack/react-query'
import { beforeAll, afterEach, afterAll, vi } from 'vitest'

// Mock InertiaJS
vi.mock('@inertiajs/react', () => ({
  usePage: vi.fn(() => ({
    props: {},
  })),
  Link: vi.fn(({ children }) => children),
  router: {
    visit: vi.fn(),
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

// Setup MSW
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// Reset React Query client
afterEach(() => {
  queryClient.clear()
})

// Create a new QueryClient for each test
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { gcTime: Number.POSITIVE_INFINITY, retry: false },
  },
})

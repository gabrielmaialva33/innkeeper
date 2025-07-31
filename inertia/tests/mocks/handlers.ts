import { http, HttpResponse } from 'msw'
import { authHandlers } from './handlers/auth'

// Define handlers for your API mocks
export const handlers = [
  // Example handler for a GET request
  http.get('/api/example', () => {
    return HttpResponse.json({ data: 'mocked data' })
  }),

  // Include all authentication handlers
  ...authHandlers,

  // Add more handlers as needed for your tests
]

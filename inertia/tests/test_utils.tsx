import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render as rtlRender } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { PropsWithChildren, ReactElement } from 'react'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { gcTime: Number.POSITIVE_INFINITY, retry: false },
  },
})

export function render(
  ui: ReactElement,
  { route, ...options }: Omit<Parameters<typeof rtlRender>[1], 'wrapper'> & { route?: string } = {
    reactStrictMode: true,
  }
) {
  // No need for window.history.pushState with Inertia
  // Inertia manages all routing server-side

  return {
    user: userEvent.setup(),
    ...rtlRender(ui, {
      wrapper: ({ children }: PropsWithChildren) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
      ...options,
    }),
  }
}

export * from '@testing-library/react'

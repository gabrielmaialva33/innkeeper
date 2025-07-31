import { router } from '@inertiajs/react'

// Helper to handle Inertia navigation with proper types
export function navigate(url: string, options?: any) {
  router.visit(url, options)
}

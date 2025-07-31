import { usePage } from '@inertiajs/react'
import type { User } from '~/types'

export function useAuth() {
  const { auth } = usePage().props as { auth?: { user?: User } }

  return {
    user: auth?.user ?? null,
    isAuthenticated: !!auth?.user,
  }
}

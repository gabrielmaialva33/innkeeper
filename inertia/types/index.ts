import type { SharedProps as InertiaSharedProps } from '@adonisjs/inertia/types'
import type { User } from './api'

export * from './api'

// Extend shared props with our app-specific props
declare module '@adonisjs/inertia/types' {
  export interface SharedProps extends InertiaSharedProps {
    auth?: {
      user?: User
    }
    flash?: {
      success?: string
      error?: string
      warning?: string
      info?: string
    }
  }
}

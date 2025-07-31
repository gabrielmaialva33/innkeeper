'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'
import { cn } from '~/utils/cn'
import { Button } from './button'
import { AnimatePresence, motion } from 'framer-motion'

const drawerVariants = cva('fixed z-50 bg-background shadow-xl transition-transform', {
  variants: {
    side: {
      top: 'inset-x-0 top-0 border-b h-auto max-h-screen',
      bottom: 'inset-x-0 bottom-0 border-t h-auto max-h-screen',
      left: 'inset-y-0 left-0 border-r w-full sm:max-w-sm',
      right: 'inset-y-0 right-0 border-l w-full sm:max-w-sm',
    },
  },
  defaultVariants: {
    side: 'right',
  },
})

interface DrawerContextType {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DrawerContext = React.createContext<DrawerContextType | undefined>(undefined)

const useDrawer = () => {
  const context = React.useContext(DrawerContext)
  if (!context) {
    throw new Error('useDrawer must be used within a DrawerProvider')
  }
  return context
}

interface DrawerProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

const Drawer = ({ open = false, onOpenChange, children }: DrawerProps) => {
  return (
    <DrawerContext.Provider value={{ open, onOpenChange: onOpenChange || (() => {}) }}>
      {children}
    </DrawerContext.Provider>
  )
}

interface DrawerTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const DrawerTrigger = React.forwardRef<HTMLButtonElement, DrawerTriggerProps>(
  ({ onClick, ...props }, ref) => {
    const { onOpenChange } = useDrawer()

    return (
      <button
        ref={ref}
        onClick={(e) => {
          onClick?.(e)
          onOpenChange(true)
        }}
        {...props}
      />
    )
  }
)
DrawerTrigger.displayName = 'DrawerTrigger'

interface DrawerContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof drawerVariants> {
  onInteractOutside?: () => void
}

const DrawerContent = React.forwardRef<HTMLDivElement, DrawerContentProps>(
  ({ className, side, children, onInteractOutside, ...props }, ref) => {
    const { open, onOpenChange } = useDrawer()

    const slideDirection = {
      top: { y: '-100%' },
      bottom: { y: '100%' },
      left: { x: '-100%' },
      right: { x: '100%' },
    }

    const exitDirection = slideDirection[side || 'right']

    return (
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black"
              onClick={() => {
                onInteractOutside?.()
                onOpenChange(false)
              }}
            />
            <motion.div
              ref={ref}
              initial={exitDirection}
              animate={{ x: 0, y: 0 }}
              exit={exitDirection}
              transition={{ type: 'tween', duration: 0.3 }}
              className={cn(drawerVariants({ side }), className)}
              {...props}
            >
              {children}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    )
  }
)
DrawerContent.displayName = 'DrawerContent'

interface DrawerHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const DrawerHeader = React.forwardRef<HTMLDivElement, DrawerHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center justify-between p-6 pb-4', className)}
      {...props}
    />
  )
)
DrawerHeader.displayName = 'DrawerHeader'

interface DrawerFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const DrawerFooter = React.forwardRef<HTMLDivElement, DrawerFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center justify-end gap-2 p-6 pt-4', className)}
      {...props}
    />
  )
)
DrawerFooter.displayName = 'DrawerFooter'

interface DrawerTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const DrawerTitle = React.forwardRef<HTMLHeadingElement, DrawerTitleProps>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn('text-lg font-semibold', className)} {...props} />
  )
)
DrawerTitle.displayName = 'DrawerTitle'

interface DrawerDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const DrawerDescription = React.forwardRef<HTMLParagraphElement, DrawerDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
  )
)
DrawerDescription.displayName = 'DrawerDescription'

interface DrawerCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const DrawerClose = React.forwardRef<HTMLButtonElement, DrawerCloseProps>(
  ({ className, onClick, ...props }, ref) => {
    const { onOpenChange } = useDrawer()

    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={cn('h-6 w-6', className)}
        onClick={(e) => {
          onClick?.(e)
          onOpenChange(false)
        }}
        {...props}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </Button>
    )
  }
)
DrawerClose.displayName = 'DrawerClose'

const DrawerBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex-1 overflow-y-auto p-6', className)} {...props} />
  )
)
DrawerBody.displayName = 'DrawerBody'

export {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerBody,
}

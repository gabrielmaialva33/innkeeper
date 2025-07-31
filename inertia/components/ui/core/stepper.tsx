import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '~/utils/cn'

interface StepperProps {
  steps: {
    label: string
    description?: string
  }[]
  currentStep: number
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export function Stepper({
  steps,
  currentStep,
  orientation = 'horizontal',
  className,
}: StepperProps) {
  return (
    <div className={cn('flex', orientation === 'vertical' ? 'flex-col' : 'flex-row', className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isCurrent = index === currentStep
        const isLast = index === steps.length - 1

        return (
          <React.Fragment key={index}>
            <div
              className={cn(
                'flex',
                orientation === 'vertical' ? 'flex-row' : 'flex-col',
                'items-center'
              )}
            >
              <div className={cn('flex items-center', orientation === 'vertical' && 'flex-col')}>
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all',
                    isCompleted
                      ? 'border-primary bg-primary text-primary-foreground'
                      : isCurrent
                        ? 'border-primary bg-background text-primary'
                        : 'border-muted-foreground/25 bg-background text-muted-foreground'
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                {!isLast && (
                  <div
                    className={cn(
                      'transition-all',
                      orientation === 'vertical' ? 'ml-5 h-20 w-0.5' : 'h-0.5 w-20',
                      isCompleted ? 'bg-primary' : 'bg-muted-foreground/25'
                    )}
                  />
                )}
              </div>
              <div className={cn(orientation === 'vertical' ? 'ml-4' : 'mt-3', 'flex flex-col')}>
                <span
                  className={cn(
                    'text-sm font-medium transition-colors',
                    isCurrent ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </span>
                {step.description && (
                  <span className="text-xs text-muted-foreground mt-1">{step.description}</span>
                )}
              </div>
            </div>
          </React.Fragment>
        )
      })}
    </div>
  )
}

interface StepperContentProps {
  children: React.ReactNode
  currentStep: number
  className?: string
}

export function StepperContent({ children, currentStep, className }: StepperContentProps) {
  const childrenArray = React.Children.toArray(children)

  return <div className={cn('mt-8', className)}>{childrenArray[currentStep] || null}</div>
}

interface StepperPanelProps {
  children: React.ReactNode
  className?: string
}

export function StepperPanel({ children, className }: StepperPanelProps) {
  return <div className={cn('space-y-4', className)}>{children}</div>
}

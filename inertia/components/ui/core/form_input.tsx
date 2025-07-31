import * as React from 'react'
import { Input, type InputProps as BaseInputProps } from './input'
import { Label } from './label'

export interface FormInputProps extends Omit<BaseInputProps, 'error'> {
  label?: string
  errorMessage?: string
  hint?: string
  rightAdornment?: React.ReactNode
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, errorMessage, hint, id, rightAdornment, ...props }, ref) => {
    const inputId = id || props.name
    const hasError = !!errorMessage

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          {label && <Label htmlFor={inputId}>{label}</Label>}
          {rightAdornment}
        </div>
        <Input
          id={inputId}
          ref={ref}
          error={hasError}
          aria-invalid={hasError}
          aria-describedby={
            errorMessage ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          {...props}
        />
        {hint && !errorMessage && (
          <p id={`${inputId}-hint`} className="text-xs text-muted-foreground">
            {hint}
          </p>
        )}
        {errorMessage && (
          <p id={`${inputId}-error`} className="text-xs text-destructive">
            {errorMessage}
          </p>
        )}
      </div>
    )
  }
)

FormInput.displayName = 'FormInput'

export { FormInput }

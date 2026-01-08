import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            'flex h-12 w-full border rounded-lg px-4 py-2 text-sm font-sans',
            'input-field', // Custom class for text color
            'transition-all duration-300',
            'focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error 
              ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' 
              : 'border-nude',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs font-sans text-red-500">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }

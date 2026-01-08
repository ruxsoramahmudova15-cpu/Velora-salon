import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
        {
          'bg-gradient-gold text-white':
            variant === 'default',
          'bg-muted light-text-secondary':
            variant === 'secondary',
          'status-success':
            variant === 'success',
          'status-warning':
            variant === 'warning',
          'status-error':
            variant === 'destructive',
          'border border-subtle bg-transparent light-text-secondary':
            variant === 'outline',
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }

import * as React from 'react'
import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot='input'
      className={cn(
        'flex h-8 w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-1 text-[13px] transition-colors duration-150 outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-xs file:font-medium file:text-foreground placeholder:text-muted-foreground/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45 dark:bg-white/[0.025]',
        'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/35',
        className
      )}
      {...props}
    />
  )
}

export { Input }

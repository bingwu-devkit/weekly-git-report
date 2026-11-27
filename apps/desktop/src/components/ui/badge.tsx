import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-md border px-1.5 py-0.5 text-[11px] leading-4 font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/30 focus-visible:ring-2 transition-colors duration-150 overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'border-border bg-primary/10 text-foreground dark:bg-white/10 dark:text-foreground',
        secondary:
          'border-border/70 bg-secondary text-secondary-foreground',
        destructive:
          'border-destructive/30 bg-destructive/12 text-destructive dark:bg-destructive/20 dark:text-[#ff7b7f]',
        outline:
          'border-border text-muted-foreground bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      data-slot='badge'
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }

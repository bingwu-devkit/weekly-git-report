import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-[13px] font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3.5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/85',
        destructive:
          'bg-destructive text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] hover:bg-destructive/90 focus-visible:ring-destructive/25',
        outline:
          'border border-border bg-transparent text-foreground hover:bg-accent/70 hover:text-accent-foreground dark:bg-white/[0.025] dark:hover:bg-white/[0.06]',
        secondary:
          'border border-border/60 bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost:
          'text-muted-foreground hover:bg-accent/70 hover:text-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-8 px-3 py-1.5 has-[>svg]:px-2.5',
        sm: 'h-7 rounded-md gap-1 px-2.5 text-xs has-[>svg]:px-2',
        lg: 'h-9 rounded-md px-4 text-sm has-[>svg]:px-3.5',
        icon: 'size-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot='button'
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

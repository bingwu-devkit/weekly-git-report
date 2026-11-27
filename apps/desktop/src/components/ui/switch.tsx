import * as React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cn } from '@/lib/utils'

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot='switch'
      className={cn(
        'peer inline-flex h-[18px] w-8 shrink-0 items-center rounded-full border border-transparent transition-colors duration-150 outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-45 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-white/15',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot='switch-thumb'
        className={cn(
          'pointer-events-none block size-3.5 rounded-full bg-white shadow-xs ring-0 transition-transform duration-150 data-[state=checked]:translate-x-[15px] data-[state=unchecked]:translate-x-[1px] dark:data-[state=checked]:bg-primary-foreground dark:data-[state=unchecked]:bg-foreground'
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }

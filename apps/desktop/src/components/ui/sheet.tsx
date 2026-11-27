import * as React from 'react'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { XIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot='sheet' {...props} />
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot='sheet-trigger' {...props} />
}

function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot='sheet-close' {...props} />
}

function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot='sheet-portal' {...props} />
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot='sheet-overlay'
      className={cn(
        'fixed inset-0 z-50 bg-black/55 backdrop-blur-[1.5px] duration-150 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0',
        className
      )}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  side = 'right',
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: 'top' | 'right' | 'bottom' | 'left'
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot='sheet-content'
        className={cn(
          'fixed z-50 flex flex-col gap-4 bg-popover text-popover-foreground shadow-2xl shadow-black/35 transition ease-out data-[state=closed]:animate-out data-[state=closed]:duration-150 data-[state=open]:animate-in data-[state=open]:duration-200',
          side === 'right' &&
            'inset-y-0 inset-e-0 h-full w-3/4 border-s border-border data-[state=closed]:slide-out-to-end data-[state=open]:slide-in-from-end sm:max-w-sm',
          side === 'left' &&
            'inset-y-0 inset-s-0 h-full w-3/4 border-e border-border data-[state=closed]:slide-out-to-start data-[state=open]:slide-in-from-start sm:max-w-sm',
          side === 'top' &&
            'inset-x-0 top-0 h-auto border-b border-border data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
          side === 'bottom' &&
            'inset-x-0 bottom-0 h-auto border-t border-border data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
          className
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className='absolute inset-e-3.5 top-3.5 rounded-md p-1 text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground focus:ring-2 focus:ring-ring/30 focus:outline-hidden disabled:pointer-events-none'>
          <XIcon className='size-4' />
          <span className='sr-only'>Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='sheet-header'
      className={cn('flex flex-col gap-1 border-b border-border px-5 py-4', className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='sheet-footer'
      className={cn('mt-auto flex flex-col gap-2 border-t border-border px-5 py-3.5', className)}
      {...props}
    />
  )
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot='sheet-title'
      className={cn('text-[15px] font-semibold tracking-[-0.015em] text-foreground', className)}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot='sheet-description'
      className={cn('text-xs leading-relaxed text-muted-foreground', className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}

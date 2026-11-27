import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'

type HeaderProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

export function Header({ className, children, ...props }: HeaderProps) {
  return (
    <header
      className={cn(
        'z-30 h-10 shrink-0 border-b border-border/80 bg-background',
        className
      )}
      {...props}
    >
      <div className='flex h-full items-center gap-2 px-4'>
        <SidebarTrigger
          variant='ghost'
          className='size-6 text-muted-foreground hover:text-foreground md:hidden'
        />
        <Separator
          orientation='vertical'
          className='h-3.5 bg-border/80 md:hidden'
        />
        <div className='flex min-w-0 flex-1 items-center gap-2'>{children}</div>
      </div>
    </header>
  )
}

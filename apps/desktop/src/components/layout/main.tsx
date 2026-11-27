import { cn } from '@/lib/utils'

type MainProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean
  fluid?: boolean
  ref?: React.Ref<HTMLElement>
}

export function Main({
  fixed,
  className,
  fluid,
  children,
  ...props
}: MainProps) {
  if (fixed) {
    return (
      <main
        data-layout='fixed'
        className={cn(
          'flex min-h-0 flex-1 flex-col overflow-hidden px-5 py-4',
          !fluid &&
            '@7xl/content:mx-auto @7xl/content:w-full @7xl/content:max-w-6xl',
          className
        )}
        {...props}
      >
        {children}
      </main>
    )
  }

  return (
    <main
      data-layout='scroll'
      className='min-h-0 flex-1 overflow-y-auto'
      {...props}
    >
      <div
        className={cn(
          'px-5 py-4',
          !fluid &&
            '@7xl/content:mx-auto @7xl/content:w-full @7xl/content:max-w-6xl',
          className
        )}
      >
        {children}
      </div>
    </main>
  )
}

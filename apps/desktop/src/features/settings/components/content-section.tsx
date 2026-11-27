import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

type ContentSectionProps = {
  title: string
  desc: string
  children: React.ReactNode
  contentClassName?: string
}

export function ContentSection({
  title,
  desc,
  children,
  contentClassName,
}: ContentSectionProps) {
  return (
    <div className='flex w-full flex-1 flex-col'>
      <div className={cn('mx-auto w-full max-w-2xl pb-12', contentClassName)}>
        <div className='space-y-0.5'>
          <h1 className='text-lg font-semibold tracking-[-0.02em] text-foreground'>
            {title}
          </h1>
          <p className='text-xs text-muted-foreground'>{desc}</p>
        </div>
        <Separator className='my-4' />
        <div>{children}</div>
      </div>
    </div>
  )
}

import { type ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { Logo } from '@/assets/logo'
import { cn } from '@/lib/utils'

type WindowTitlebarProps = {
  brandTo?: '/'
  subtitle?: string
  leftExtra?: ReactNode
  leftClassName?: string
  center?: ReactNode
  right?: ReactNode
  className?: string
}

export function WindowTitlebar({
  brandTo,
  subtitle,
  leftExtra,
  leftClassName,
  center,
  right,
  className,
}: WindowTitlebarProps) {
  const isMac = window.electronAPI?.platform === 'darwin'
  const isWindows = window.electronAPI?.platform === 'win32'

  const brand = (
    <span className='flex min-w-0 items-center gap-2'>
      <Logo className='size-4.5 shrink-0' />
      <span className='truncate text-[12.5px] font-semibold tracking-[-0.015em] text-foreground'>
        Weekly Git Report
      </span>
    </span>
  )

  return (
    <div
      data-slot='window-titlebar'
      className={cn(
        'app-drag relative z-50 flex h-9 shrink-0 items-center bg-sidebar px-2 text-sidebar-foreground select-none',
        isMac && 'ps-[78px]',
        isWindows && 'pe-[138px]',
        className
      )}
    >
      <div
        className={cn(
          'flex min-w-0 items-center gap-1.5',
          leftClassName
        )}
      >
        {brandTo ? (
          <Link
            to={brandTo}
            className='app-no-drag flex min-w-0 items-center rounded-md px-1.5 py-0.5 transition-colors duration-150 hover:bg-sidebar-accent'
          >
            {brand}
          </Link>
        ) : (
          <div className='flex min-w-0 items-center px-1.5'>{brand}</div>
        )}
        {subtitle ? (
          <div className='flex min-w-0 items-center gap-1.5 text-xs'>
            <span className='text-muted-foreground/45'>/</span>
            <span className='truncate text-muted-foreground'>{subtitle}</span>
          </div>
        ) : null}
        {leftExtra ? (
          <div className='app-no-drag ms-auto flex shrink-0 items-center'>
            {leftExtra}
          </div>
        ) : null}
      </div>

      {center ? (
        <div className='app-no-drag absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center'>
          {center}
        </div>
      ) : null}

      {right ? (
        <div className='app-no-drag ms-auto flex shrink-0 items-center gap-1.5'>
          {right}
        </div>
      ) : null}
    </div>
  )
}

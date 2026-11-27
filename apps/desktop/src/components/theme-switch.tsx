import { Check, Laptop, Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/context/theme-provider'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type ThemeSwitchProps = {
  variant?: 'icon' | 'sidebar'
  className?: string
}

const THEME_LABELS = {
  dark: '深色',
  light: '浅色',
  system: '跟随系统',
} as const

export function ThemeSwitch({ variant = 'icon', className }: ThemeSwitchProps) {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        {variant === 'sidebar' ? (
          <button
            type='button'
            className={cn(
              'app-no-drag flex h-7 w-full items-center gap-2 rounded-md px-2 text-xs text-sidebar-foreground transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring/30 focus-visible:outline-hidden group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:px-0',
              className
            )}
            aria-label='切换主题'
          >
            <Sun className='size-3.5 shrink-0 scale-100 rotate-0 transition-transform dark:hidden' />
            <Moon className='hidden size-3.5 shrink-0 transition-transform dark:block' />
            <span className='truncate group-data-[collapsible=icon]:hidden'>
              主题 · {THEME_LABELS[theme]}
            </span>
          </button>
        ) : (
          <Button
            variant='ghost'
            size='icon'
            className={cn('app-no-drag size-7 rounded-md', className)}
          >
            <Sun className='size-3.5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
            <Moon className='absolute size-3.5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
            <span className='sr-only'>切换主题</span>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={variant === 'sidebar' ? 'start' : 'end'}
        side={variant === 'sidebar' ? 'top' : 'bottom'}
      >
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className='size-3.5' />
          <span>深色</span>
          <Check
            size={14}
            className={cn('ms-auto text-primary', theme !== 'dark' && 'hidden')}
          />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className='size-3.5' />
          <span>浅色</span>
          <Check
            size={14}
            className={cn('ms-auto text-primary', theme !== 'light' && 'hidden')}
          />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Laptop className='size-3.5' />
          <span>跟随系统</span>
          <Check
            size={14}
            className={cn('ms-auto text-primary', theme !== 'system' && 'hidden')}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

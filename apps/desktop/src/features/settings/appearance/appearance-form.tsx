import { Check, Laptop, Moon, Sun } from 'lucide-react'
import { useTheme, type Theme } from '@/context/theme-provider'
import { showSuccessToast } from '@/lib/toast'
import { cn } from '@/lib/utils'

const THEME_OPTIONS: Array<{
  value: Theme
  label: string
  description: string
  icon: React.ElementType
}> = [
  {
    value: 'dark',
    label: '深色',
    description: 'Obsidian 极暗中性灰，适合长时间专注工作',
    icon: Moon,
  },
  {
    value: 'light',
    label: '浅色',
    description: '纯净高对比浅灰白，明亮清晰',
    icon: Sun,
  },
  {
    value: 'system',
    label: '跟随系统',
    description: '自动同步操作系统深浅色外观',
    icon: Laptop,
  },
]

export function AppearanceForm() {
  const { theme, setTheme } = useTheme()

  function handleSelect(next: Theme) {
    if (next === theme) return
    setTheme(next)
    showSuccessToast('显示主题已切换')
  }

  return (
    <div className='space-y-5'>
      <div className='space-y-1'>
        <h2 className='text-[13.5px] font-medium text-foreground'>显示主题</h2>
        <p className='text-xs text-muted-foreground'>
          立即生效并同步桌面窗口标题栏配色。
        </p>
      </div>

      <div
        role='radiogroup'
        aria-label='选择显示主题'
        className='grid gap-3 sm:grid-cols-3'
      >
        {THEME_OPTIONS.map((option) => {
          const Icon = option.icon
          const selected = theme === option.value
          return (
            <button
              key={option.value}
              type='button'
              role='radio'
              aria-checked={selected}
              onClick={() => handleSelect(option.value)}
              className={cn(
                'group flex flex-col overflow-hidden rounded-lg border text-start transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:outline-hidden',
                selected
                  ? 'border-primary bg-primary/[0.06]'
                  : 'border-border bg-card hover:border-muted-foreground/40 hover:bg-accent/35'
              )}
            >
              <div className='p-2.5 pb-2'>
                <ThemePreview kind={option.value} />
              </div>
              <div className='flex items-start justify-between gap-2 border-t border-border/70 px-3 py-2.5'>
                <div className='min-w-0'>
                  <div className='flex items-center gap-1.5 text-[13px] font-medium text-foreground'>
                    <Icon className='size-3.5 text-muted-foreground' />
                    <span>{option.label}</span>
                  </div>
                  <p className='mt-0.5 text-[11px] leading-relaxed text-muted-foreground'>
                    {option.description}
                  </p>
                </div>
                <span
                  className={cn(
                    'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors',
                    selected
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border'
                  )}
                >
                  {selected && <Check className='size-2.5 stroke-[3]' />}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ThemePreview({ kind }: { kind: Theme }) {
  if (kind === 'system') {
    return (
      <div className='grid h-22 grid-cols-2 overflow-hidden rounded-md border border-border/80'>
        <div className='flex gap-1 bg-[#0B0C0E] p-1.5'>
          <div className='w-5 space-y-1 pt-1'>
            <div className='h-1.5 w-3.5 rounded-xs bg-white/80' />
            <div className='h-1 w-4 rounded-xs bg-white/15' />
            <div className='h-1 w-3 rounded-xs bg-white/10' />
          </div>
          <div className='flex-1 space-y-1.5 rounded-xs border border-white/10 bg-[#101114] p-1.5'>
            <div className='h-1.5 w-8 rounded-xs bg-white/30' />
            <div className='h-1 w-full rounded-xs bg-white/10' />
            <div className='h-1 w-3/4 rounded-xs bg-white/10' />
          </div>
        </div>
        <div className='flex gap-1 bg-[#F6F7F8] p-1.5'>
          <div className='w-5 space-y-1 pt-1'>
            <div className='h-1.5 w-3.5 rounded-xs bg-[#14161A]' />
            <div className='h-1 w-4 rounded-xs bg-black/15' />
            <div className='h-1 w-3 rounded-xs bg-black/10' />
          </div>
          <div className='flex-1 space-y-1.5 rounded-xs border border-black/10 bg-white p-1.5'>
            <div className='h-1.5 w-8 rounded-xs bg-black/25' />
            <div className='h-1 w-full rounded-xs bg-black/10' />
            <div className='h-1 w-3/4 rounded-xs bg-black/10' />
          </div>
        </div>
      </div>
    )
  }

  const dark = kind === 'dark'
  return (
    <div
      className={cn(
        'flex h-22 gap-1.5 overflow-hidden rounded-md border p-1.5',
        dark
          ? 'border-white/10 bg-[#0B0C0E]'
          : 'border-black/10 bg-[#F6F7F8]'
      )}
    >
      <div className='flex w-9 flex-col gap-1.5 pt-1'>
        <div
          className={cn(
            'h-2 w-6 rounded-xs',
            dark ? 'bg-white/80' : 'bg-[#14161A]'
          )}
        />
        <div
          className={cn(
            'h-1.5 w-full rounded-xs',
            dark ? 'bg-white/15' : 'bg-black/12'
          )}
        />
        <div
          className={cn(
            'h-1.5 w-7 rounded-xs',
            dark ? 'bg-white/10' : 'bg-black/8'
          )}
        />
        <div
          className={cn(
            'h-1.5 w-8 rounded-xs',
            dark ? 'bg-white/10' : 'bg-black/8'
          )}
        />
      </div>
      <div
        className={cn(
          'flex flex-1 flex-col gap-1.5 rounded-xs border p-2',
          dark
            ? 'border-white/10 bg-[#101114]'
            : 'border-black/10 bg-white'
        )}
      >
        <div className='flex items-center justify-between'>
          <div
            className={cn(
              'h-2 w-14 rounded-xs',
              dark ? 'bg-white/35' : 'bg-black/25'
            )}
          />
          <div
            className={cn(
              'h-2 w-5 rounded-xs',
              dark ? 'bg-white/85' : 'bg-[#14161A]'
            )}
          />
        </div>
        <div
          className={cn(
            'h-px w-full',
            dark ? 'bg-white/10' : 'bg-black/8'
          )}
        />
        <div className='space-y-1.5'>
          <div
            className={cn(
              'h-1.5 w-full rounded-xs',
              dark ? 'bg-white/12' : 'bg-black/10'
            )}
          />
          <div
            className={cn(
              'h-1.5 w-4/5 rounded-xs',
              dark ? 'bg-white/8' : 'bg-black/8'
            )}
          />
          <div
            className={cn(
              'h-1.5 w-3/5 rounded-xs',
              dark ? 'bg-white/8' : 'bg-black/6'
            )}
          />
        </div>
      </div>
    </div>
  )
}

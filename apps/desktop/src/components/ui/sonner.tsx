import { Toaster as Sonner, ToasterProps } from 'sonner'
import { useTheme } from '@/context/theme-provider'

export function Toaster({ ...props }: ToasterProps) {
  const { resolvedTheme } = useTheme()

  return (
    <Sonner
      theme={resolvedTheme as ToasterProps['theme']}
      className='toaster group [&_div[data-content]]:w-full'
      toastOptions={{
        classNames: {
          toast:
            'rounded-lg border border-border bg-popover text-popover-foreground shadow-xl shadow-black/25 text-[13px]',
          description: 'text-xs text-muted-foreground',
        },
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

import { Outlet } from '@tanstack/react-router'
import { PanelLeft, Search } from 'lucide-react'
import { getCookie } from '@/lib/cookies'
import { cn } from '@/lib/utils'
import { SearchProvider, useSearch } from '@/context/search-provider'
import {
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { WindowTitlebar } from '@/components/layout/window-titlebar'
import { SkipToMain } from '@/components/skip-to-main'

type AuthenticatedLayoutProps = {
  children?: React.ReactNode
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const defaultOpen = getCookie('sidebar_state') !== 'false'
  return (
    <SearchProvider>
      <SidebarProvider
        defaultOpen={defaultOpen}
        data-desktop-shell='true'
        className='h-svh min-h-0 flex-col overflow-hidden bg-sidebar'
      >
        <SkipToMain />
        <WorkspaceTitlebar />
        <div className='flex min-h-0 flex-1 overflow-hidden'>
          <AppSidebar />
          <SidebarInset className='@container/content'>
            {children ?? <Outlet />}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </SearchProvider>
  )
}

function WorkspaceTitlebar() {
  const { state, toggleSidebar } = useSidebar()
  const { setOpen } = useSearch()
  const isMac = window.electronAPI?.platform === 'darwin'

  return (
    <WindowTitlebar
      brandTo='/'
      leftClassName={cn(
        'transition-[width] duration-150 ease-out',
        state === 'expanded'
          ? isMac
            ? 'md:w-auto'
            : 'md:w-[calc(var(--sidebar-width)-1rem)] md:pe-1'
          : 'md:w-auto'
      )}
      leftExtra={
        <div className='flex items-center gap-0.5'>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type='button'
                onClick={() => setOpen(true)}
                aria-label='搜索或执行命令'
                className='flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring/30 focus-visible:outline-hidden'
              >
                <Search className='size-3.5' />
              </button>
            </TooltipTrigger>
            <TooltipContent side='bottom' className='flex items-center gap-1.5'>
              <span>搜索或命令</span>
              <kbd className='rounded border border-border bg-muted/60 px-1 py-px font-mono text-[10px] text-muted-foreground'>
                {isMac ? '⌘K' : '⌃K'}
              </kbd>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type='button'
                onClick={toggleSidebar}
                aria-label='切换侧边栏'
                className='flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring/30 focus-visible:outline-hidden'
              >
                <PanelLeft className='size-3.5' />
              </button>
            </TooltipTrigger>
            <TooltipContent side='bottom' className='flex items-center gap-1.5'>
              <span>切换侧边栏</span>
              <kbd className='rounded border border-border bg-muted/60 px-1 py-px font-mono text-[10px] text-muted-foreground'>
                {isMac ? '⌘B' : '⌃B'}
              </kbd>
            </TooltipContent>
          </Tooltip>
        </div>
      }
    />
  )
}

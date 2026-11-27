import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  Activity,
  ArrowRight,
  CalendarClock,
  ChevronRight,
  FilePlus2,
  FolderSync,
  Laptop,
  Moon,
  Sparkles,
  Sun,
} from 'lucide-react'
import { useSearch } from '@/context/search-provider'
import { useTheme } from '@/context/theme-provider'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import { sidebarData } from './layout/data/sidebar-data'
import { ScrollArea } from './ui/scroll-area'

export function CommandMenu() {
  const navigate = useNavigate()
  const { setTheme } = useTheme()
  const { open, setOpen } = useSearch()

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false)
      command()
    },
    [setOpen]
  )

  return (
    <CommandDialog modal open={open} onOpenChange={setOpen}>
      <CommandInput placeholder='搜索页面或命令…' />
      <CommandList>
        <ScrollArea type='hover' className='h-80 pe-1'>
          <CommandEmpty>没有匹配结果。</CommandEmpty>
          <CommandGroup heading='快捷操作'>
            <CommandItem
              value='立即生成报告 create report'
              onSelect={() => runCommand(() => navigate({ to: '/reports' }))}
            >
              <FilePlus2 />
              <span>立即生成报告</span>
              <CommandShortcut>报告库</CommandShortcut>
            </CommandItem>
            <CommandItem
              value='管理与同步仓库 sync repositories'
              onSelect={() =>
                runCommand(() => navigate({ to: '/repositories' }))
              }
            >
              <FolderSync />
              <span>管理与同步仓库</span>
              <CommandShortcut>仓库</CommandShortcut>
            </CommandItem>
            <CommandItem
              value='管理定时调度 schedule tasks'
              onSelect={() => runCommand(() => navigate({ to: '/tasks' }))}
            >
              <CalendarClock />
              <span>管理定时调度</span>
              <CommandShortcut>调度</CommandShortcut>
            </CommandItem>
            <CommandItem
              value='查看执行日志 runs history'
              onSelect={() => runCommand(() => navigate({ to: '/runs' }))}
            >
              <Activity />
              <span>查看执行日志</span>
              <CommandShortcut>记录</CommandShortcut>
            </CommandItem>
            <CommandItem
              value='打开初始化向导 setup onboarding'
              onSelect={() => runCommand(() => navigate({ to: '/setup' }))}
            >
              <Sparkles />
              <span>打开初始化向导</span>
              <CommandShortcut>向导</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          {sidebarData.navGroups.map((group) => (
            <CommandGroup key={group.title} heading={group.title}>
              {group.items.map((navItem, i) => {
                if (navItem.url) {
                  const Icon = navItem.icon
                  return (
                    <CommandItem
                      key={`${navItem.url}-${i}`}
                      value={navItem.title}
                      onSelect={() => {
                        runCommand(() => navigate({ to: navItem.url }))
                      }}
                    >
                      {Icon ? (
                        <Icon />
                      ) : (
                        <ArrowRight className='size-3 text-muted-foreground/80' />
                      )}
                      <span>{navItem.title}</span>
                    </CommandItem>
                  )
                }

                return navItem.items?.map((subItem, j) => (
                  <CommandItem
                    key={`${navItem.title}-${subItem.url}-${j}`}
                    value={`${navItem.title}-${subItem.url}`}
                    onSelect={() => {
                      runCommand(() => navigate({ to: subItem.url }))
                    }}
                  >
                    <ArrowRight className='size-3 text-muted-foreground/80' />
                    {navItem.title} <ChevronRight /> {subItem.title}
                  </CommandItem>
                ))
              })}
            </CommandGroup>
          ))}
          <CommandSeparator />
          <CommandGroup heading='主题'>
            <CommandItem onSelect={() => runCommand(() => setTheme('dark'))}>
              <Moon />
              <span>深色</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('light'))}>
              <Sun />
              <span>浅色</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('system'))}>
              <Laptop />
              <span>跟随系统</span>
            </CommandItem>
          </CommandGroup>
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  )
}

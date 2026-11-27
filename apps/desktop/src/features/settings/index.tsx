import { Outlet, useLocation } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'

export function Settings() {
  const { pathname } = useLocation()
  const page = settingsPageCopy(pathname)

  return (
    <>
      <Header>
        <div className='me-auto flex items-center gap-1.5 text-xs'>
          <span className='text-muted-foreground'>系统</span>
          <span className='text-muted-foreground/50'>/</span>
          <span className='font-medium text-foreground'>{page.title}</span>
        </div>
      </Header>
      <Main fixed fluid className='p-0'>
        <div className='flex min-h-0 flex-1 overflow-y-auto px-6 py-5'>
          <Outlet />
        </div>
      </Main>
    </>
  )
}

function settingsPageCopy(pathname: string) {
  if (pathname === '/settings/template') {
    return {
      title: '报告模板',
      description: '设置日报、周报、月报和自定义报告的生成规则。',
    }
  }
  if (pathname === '/settings/automation') {
    return {
      title: 'AI 与推送',
      description: '配置报告生成服务、API 密钥和飞书机器人。',
    }
  }
  if (pathname === '/settings/about') {
    return { title: '关于与更新', description: '查看当前版本、更新状态和版本说明。' }
  }
  if (pathname === '/settings/appearance') {
    return { title: '外观', description: '选择应用界面的深浅色主题模式。' }
  }
  return {
    title: '常规设置',
    description: '管理报告目录、仓库缓存和 Git 作者身份。',
  }
}

import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import {
  AlertCircle,
  ChevronRight,
  FileText,
  FolderGit2,
  RefreshCw,
  Settings2,
  TriangleAlert,
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { OverflowTooltip } from '@/components/overflow-tooltip'
import { getErrorMessage } from '@/lib/errors'
import { onboardingQueryOptions, overviewQueryOptions } from '@/lib/desktop-queries'
import { showSuccessToast } from '@/lib/toast'
import { cn } from '@/lib/utils'

export function Dashboard() {
  const overview = useQuery(overviewQueryOptions)
  const onboarding = useQuery(onboardingQueryOptions)

  const data = overview.data
  const healthyChecks = data?.diagnostics.filter((check) => check.status === 'ok').length ?? 0
  const activeRuns = data
    ? (data.runCounts.queued ?? 0) +
      (data.runCounts.collecting ?? 0) +
      (data.runCounts.generating ?? 0) +
      (data.runCounts.saving ?? 0) +
      (data.runCounts.publishing ?? 0)
    : undefined
  const failedRuns = data
    ? (data.runCounts.failed ?? 0) + (data.runCounts.publish_failed ?? 0)
    : undefined

  async function refreshOverview() {
    const result = await overview.refetch()
    if (!result.isError) showSuccessToast('总览已刷新')
  }

  return (
    <>
      <Header>
        <div className='me-auto flex items-center gap-1.5 text-xs'>
          <span className='text-muted-foreground'>工作台</span>
          <span className='text-muted-foreground/50'>/</span>
          <span className='font-medium text-foreground'>总览</span>
        </div>
        <Button
          size='sm'
          variant='ghost'
          onClick={() => void refreshOverview()}
          disabled={overview.isFetching}
        >
          <RefreshCw className={overview.isFetching ? 'animate-spin' : ''} />
          刷新
        </Button>
      </Header>

      <Main className='space-y-5'>
        <div className='flex flex-wrap items-end justify-between gap-3'>
          <div>
            <h1 className='text-lg font-semibold tracking-[-0.02em]'>总览</h1>
            <p className='mt-0.5 text-xs text-muted-foreground'>
              查看仓库、报告和桌面运行环境的当前状态。
            </p>
          </div>
        </div>

        {overview.isError && (
          <Alert variant='destructive'>
            <AlertCircle />
            <AlertTitle>无法读取本地状态</AlertTitle>
            <AlertDescription className='[overflow-wrap:anywhere]'>
              {getErrorMessage(overview.error)}
            </AlertDescription>
          </Alert>
        )}

        {data?.initialized && data.projectCount === 0 && (
          <Alert>
            <TriangleAlert />
            <AlertTitle>还没有添加仓库</AlertTitle>
            <AlertDescription>
              <p>可以继续设置并完成首次同步，也可以直接前往仓库管理。</p>
              <div className='mt-2 flex flex-wrap gap-2'>
                <Button asChild size='sm'>
                  <Link to='/setup'>继续设置</Link>
                </Button>
                <Button asChild size='sm' variant='outline'>
                  <Link to='/repositories'>仓库管理</Link>
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {onboarding.data && !onboarding.data.completedAt ? (
          <Alert>
            <TriangleAlert />
            <AlertTitle>首次设置尚未完成</AlertTitle>
            <AlertDescription>
              <p>继续配置仓库和 AI，并审核保存第一份报告。当前会话仍可使用已就绪的功能。</p>
              <Button asChild size='sm' className='mt-2'>
                <Link to='/setup'>继续首次设置</Link>
              </Button>
            </AlertDescription>
          </Alert>
        ) : onboarding.data?.completedAt &&
          (!onboarding.data.readiness.repositoryReady ||
            !onboarding.data.readiness.templatesReady) ? (
          <Alert variant='destructive'>
            <TriangleAlert />
            <AlertTitle>报告生成条件需要修复</AlertTitle>
            <AlertDescription>
              仓库或报告模板已不再就绪。前往首次设置检查并修复。
              <Button asChild size='sm' variant='outline' className='mt-2 ms-2'>
                <Link to='/setup'>查看检查清单</Link>
              </Button>
            </AlertDescription>
          </Alert>
        ) : onboarding.data?.completedAt && !onboarding.data.readiness.aiReady ? (
          <Alert>
            <TriangleAlert />
            <AlertTitle>AI 服务尚未配置</AlertTitle>
            <AlertDescription>
              配置 API Key、Base URL 和模型后即可生成报告。
              <Button asChild size='sm' variant='outline' className='mt-2 ms-2'>
                <Link to='/settings/automation'>配置 AI</Link>
              </Button>
            </AlertDescription>
          </Alert>
        ) : null}

        <section className='grid grid-cols-2 overflow-hidden rounded-lg border border-border bg-card sm:grid-cols-4 xl:grid-cols-7'>
          <MetricCell
            title='已启用仓库'
            value={data ? `${data.enabledProjectCount}/${data.projectCount}` : '—'}
            description='启用 / 全部'
            dot={data && data.enabledProjectCount > 0 ? 'ok' : 'muted'}
          />
          <MetricCell
            title='报告文件'
            value={data?.reportCount.toString() ?? '—'}
            description='报告目录总数'
          />
          <MetricCell
            title='自动任务'
            value={data?.enabledTaskCount.toString() ?? '—'}
            description='已启用调度'
          />
          <MetricCell
            title='排队 / 运行'
            value={activeRuns?.toString() ?? '—'}
            description='进行中任务'
            dot={activeRuns && activeRuns > 0 ? 'primary' : 'muted'}
          />
          <MetricCell
            title='待审核草稿'
            value={data?.runCounts.awaiting_review?.toString() ?? '0'}
            description='待确认保存'
            dot={
              data?.runCounts.awaiting_review && data.runCounts.awaiting_review > 0
                ? 'warning'
                : 'muted'
            }
          />
          <MetricCell
            title='失败执行'
            value={failedRuns?.toString() ?? '—'}
            description='含推送失败'
            dot={failedRuns && failedRuns > 0 ? 'error' : 'muted'}
          />
          <MetricCell
            title='环境检查'
            value={data ? `${healthyChecks}/${data.diagnostics.length}` : '—'}
            description='Git 与目录'
            dot={
              data
                ? healthyChecks === data.diagnostics.length
                  ? 'ok'
                  : 'warning'
                : 'muted'
            }
          />
        </section>

        <div className='grid gap-4 lg:grid-cols-[1.45fr_1fr]'>
          <section className='overflow-hidden rounded-lg border border-border bg-card'>
            <div className='flex items-center justify-between border-b border-border/80 px-4 py-2.5'>
              <div>
                <h2 className='text-[13px] font-medium text-foreground'>环境状态</h2>
                <p className='text-[11.5px] text-muted-foreground'>
                  检查生成报告所需的本地环境和目录。
                </p>
              </div>
              {data && (
                <span className='font-mono text-[11px] text-muted-foreground tabular-nums'>
                  {healthyChecks}/{data.diagnostics.length} 正常
                </span>
              )}
            </div>
            <div className='divide-y divide-border/70'>
              {data?.diagnostics.map((check) => (
                <div
                  key={check.id}
                  className='flex items-center justify-between gap-3 px-4 py-2.5 transition-colors duration-100 hover:bg-accent/35'
                >
                  <div className='flex min-w-0 flex-1 items-start gap-2.5'>
                    <span
                      className={cn(
                        'mt-1.5 size-1.5 shrink-0 rounded-full',
                        check.status === 'ok'
                          ? 'bg-emerald-500'
                          : check.status === 'warning'
                            ? 'bg-amber-500'
                            : 'bg-destructive'
                      )}
                    />
                    <div className='min-w-0 flex-1'>
                      <p className='text-[13px] font-medium text-foreground'>
                        {check.label}
                      </p>
                      <OverflowTooltip
                        text={check.message}
                        className='text-xs text-muted-foreground'
                      />
                    </div>
                  </div>
                  <StatusBadge status={check.status} />
                </div>
              ))}
              {!data && (
                <p className='px-4 py-6 text-xs text-muted-foreground'>
                  正在读取环境状态…
                </p>
              )}
            </div>
          </section>

          <section className='flex flex-col overflow-hidden rounded-lg border border-border bg-card'>
            <div className='border-b border-border/80 px-4 py-2.5'>
              <h2 className='text-[13px] font-medium text-foreground'>快速开始</h2>
              <p className='text-[11.5px] text-muted-foreground'>
                从现有仓库配置、报告和常规设置开始。
              </p>
            </div>
            <div className='divide-y divide-border/70'>
              <QuickActionRow
                to='/repositories'
                icon={FolderGit2}
                title='查看仓库'
                description='同步本地缓存、管理参与采集的 Git 仓库'
              />
              <QuickActionRow
                to='/reports'
                icon={FileText}
                title='浏览报告'
                description='按周期筛选历史报告、生成或推送新报告'
              />
              <QuickActionRow
                to='/settings'
                icon={Settings2}
                title='检查常规设置'
                description='管理报告输出目录、缓存路径与 Git 作者身份'
              />
            </div>
            {data?.config && (
              <div className='mt-auto border-t border-border/80 bg-muted/25 px-4 py-3'>
                <p className='text-[11px] font-medium text-muted-foreground'>
                  当前报告目录
                </p>
                <p className='mt-1 font-mono text-xs text-foreground/90 [overflow-wrap:anywhere]'>
                  {data.config.outputRoot}
                </p>
              </div>
            )}
          </section>
        </div>
      </Main>
    </>
  )
}

type MetricCellProps = {
  title: string
  value: string
  description: string
  dot?: 'ok' | 'warning' | 'error' | 'primary' | 'muted'
}

function MetricCell({ title, value, description, dot }: MetricCellProps) {
  return (
    <div className='flex flex-col justify-between gap-1.5 border-e border-b border-border/70 px-3.5 py-3 last:border-e-0 xl:border-b-0'>
      <div className='flex items-center justify-between gap-1.5'>
        <span className='truncate text-[11.5px] font-medium text-muted-foreground'>
          {title}
        </span>
        {dot && (
          <span
            className={cn(
              'size-1.5 shrink-0 rounded-full',
              dot === 'ok' && 'bg-emerald-500',
              dot === 'warning' && 'bg-amber-500',
              dot === 'error' && 'bg-destructive',
              dot === 'primary' && 'bg-primary',
              dot === 'muted' && 'bg-muted-foreground/35'
            )}
          />
        )}
      </div>
      <div className='text-xl font-semibold tracking-[-0.02em] text-foreground tabular-nums'>
        {value}
      </div>
      <span className='truncate text-[11px] text-muted-foreground/85'>
        {description}
      </span>
    </div>
  )
}

function QuickActionRow({
  to,
  icon: Icon,
  title,
  description,
}: {
  to: '/repositories' | '/reports' | '/settings'
  icon: React.ElementType
  title: string
  description: string
}) {
  return (
    <Link
      to={to}
      className='group flex items-center gap-3 px-4 py-3 transition-colors duration-100 hover:bg-accent/45'
    >
      <span className='flex size-7 shrink-0 items-center justify-center rounded-md border border-border/80 bg-muted/40 text-muted-foreground transition-colors group-hover:text-foreground'>
        <Icon className='size-3.5' />
      </span>
      <span className='min-w-0 flex-1'>
        <span className='block text-[13px] font-medium text-foreground'>
          {title}
        </span>
        <span className='block truncate text-xs text-muted-foreground'>
          {description}
        </span>
      </span>
      <ChevronRight className='size-3.5 shrink-0 text-muted-foreground/60 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-foreground' />
    </Link>
  )
}

function StatusBadge({ status }: { status: 'ok' | 'warning' | 'error' }) {
  if (status === 'ok') return <Badge variant='secondary'>正常</Badge>
  if (status === 'warning') return <Badge variant='outline'>待处理</Badge>
  return <Badge variant='destructive'>错误</Badge>
}

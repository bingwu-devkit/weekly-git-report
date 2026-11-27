import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query'
import { AlertCircle, Loader2, RefreshCw, RotateCcw, Save } from 'lucide-react'
import type { Period, ReportType, SummaryTemplateResult } from '@weekly-git-report/shared'
import { useUnsavedChanges } from '@/hooks/use-unsaved-changes'
import { MarkdownViewer } from '@/components/markdown-viewer'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { getErrorMessage } from '@/lib/errors'
import { showErrorToast, showSuccessToast } from '@/lib/toast'
import { ContentSection } from '../components/content-section'

export function SettingsTemplate() {
  const [cadence, setCadence] = useState<ReportType>('weekly')
  const [dirty, setDirty] = useState(false)
  const period = useMemo(() => getExamplePeriod(cadence), [cadence])
  const template = useQuery({
    queryKey: getTemplateQueryKey(cadence, period),
    queryFn: () => window.electronAPI.templates.read(cadence, period),
  })

  function selectCadence(value: string) {
    const next = value as ReportType
    if (next === cadence) return
    if (dirty && !window.confirm('当前模板有未保存的修改，确定切换模板吗？')) return
    setDirty(false)
    setCadence(next)
  }

  return (
    <ContentSection
      title='报告模板'
      desc='桌面端和命令行工具使用同一套报告生成规则。'
      contentClassName='max-w-5xl'
    >
      <Tabs value={cadence} onValueChange={selectCadence} className='space-y-4'>
        <TabsList>
          {CADENCE_OPTIONS.map((option) => (
            <TabsTrigger key={option.value} value={option.value}>{option.label}模板</TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={cadence} className='mt-0 space-y-4'>
          {template.isLoading && <Loading />}
          {template.isError && (
            <Alert variant='destructive'>
              <AlertCircle />
              <AlertTitle>无法读取报告模板</AlertTitle>
              <AlertDescription>{getErrorMessage(template.error)}</AlertDescription>
            </Alert>
          )}
          {template.data && (
            <SummaryTemplateEditor
              key={`${template.data.type}-${template.data.template.revision}`}
              initial={template.data}
              cadence={cadence}
              period={period}
              onDirtyChange={setDirty}
            />
          )}
        </TabsContent>
      </Tabs>
    </ContentSection>
  )
}

interface SummaryTemplateEditorProps {
  initial: SummaryTemplateResult
  cadence?: ReportType
  period: Period
  onDirtyChange?(dirty: boolean): void
}

export function SummaryTemplateEditor({
  initial,
  cadence = initial.type,
  period,
  onDirtyChange,
}: SummaryTemplateEditorProps) {
  const queryClient = useQueryClient()
  const [content, setContent] = useState(initial.template.content)
  const [preview, setPreview] = useState(initial.template.renderedContent)
  const [previewError, setPreviewError] = useState<string>()
  const [reloading, setReloading] = useState(false)
  const [resetDialogOpen, setResetDialogOpen] = useState(false)
  const dirty = content !== initial.template.content
  useUnsavedChanges(dirty)

  useEffect(() => {
    onDirtyChange?.(dirty)
  }, [dirty, onDirtyChange])

  useEffect(() => {
    let cancelled = false
    const timeout = window.setTimeout(() => {
      void updatePreview()
    }, 200)

    async function updatePreview() {
      try {
        const next = await window.electronAPI.templates.preview({
          reportType: cadence,
          content,
          period,
          ...(cadence === 'custom' ? { reportTitle: '示例自定义报告' } : {}),
        })
        if (cancelled) return
        setPreview(next)
        setPreviewError(undefined)
      } catch (error) {
        if (cancelled) return
        setPreview(null)
        setPreviewError(getErrorMessage(error))
      }
    }

    return () => {
      cancelled = true
      window.clearTimeout(timeout)
    }
  }, [cadence, content, period])

  const save = useMutation({
    mutationFn: () =>
      window.electronAPI.templates.save({
        content,
        reportType: cadence,
        expectedRevision: initial.template.revision,
        period,
      }),
    onSuccess: (next) => {
      setTemplateQueryData(queryClient, cadence, period, next)
      setContent(next.template.content)
      setPreview(next.template.renderedContent)
      showSuccessToast('报告模板已保存')
    },
    onError: (error) => showTemplateError(error),
  })

  const reset = useMutation({
    mutationFn: () =>
      window.electronAPI.templates.reset({
        expectedRevision: initial.template.revision,
        reportType: cadence,
        period,
      }),
    onSuccess: (next) => {
      setTemplateQueryData(queryClient, cadence, period, next)
      setContent(next.template.content)
      setPreview(next.template.renderedContent)
      setResetDialogOpen(false)
      showSuccessToast('已恢复默认报告模板')
    },
    onError: (error) => showTemplateError(error),
  })

  async function reload() {
    if (dirty && !window.confirm('当前模板有未保存的修改，确定重新读取吗？')) return
    setReloading(true)
    try {
      const next = await window.electronAPI.templates.read(cadence, period)
      setTemplateQueryData(queryClient, cadence, period, next)
      setContent(next.template.content)
      setPreview(next.template.renderedContent)
      setPreviewError(undefined)
      showSuccessToast('报告模板已重新读取')
    } catch (error) {
      showErrorToast(getErrorMessage(error))
    } finally {
      setReloading(false)
    }
  }

  function restoreDefault(event: React.MouseEvent) {
    if (initial.template.isDefault) {
      setContent(initial.template.content)
      setPreview(initial.template.renderedContent)
      setPreviewError(undefined)
      return
    }
    event.preventDefault()
    reset.mutate()
  }

  return (
    <div className='space-y-4'>
      <Alert>
        <AlertTitle>模板在桌面端和命令行工具间共享</AlertTitle>
        <AlertDescription>
          生成报告时，AI 会同时读取当前模板和本次采集的数据。采集数据不会写入模板文件。
        </AlertDescription>
      </Alert>

      <section className='overflow-hidden rounded-lg border border-border bg-card'>
        <div className='flex flex-wrap items-start justify-between gap-3 border-b border-border/80 px-4 py-3'>
          <div className='space-y-1'>
            <div className='flex flex-wrap items-center gap-2'>
              <h2 className='text-[13.5px] font-medium text-foreground'>
                {getCadenceLabel(cadence)}模板
              </h2>
              <Badge variant={dirty ? 'default' : initial.template.isDefault ? 'secondary' : 'outline'}>
                {dirty ? '未保存修改' : initial.template.isDefault ? '默认模板' : '自定义模板'}
              </Badge>
            </div>
            <p className='break-all font-mono text-[11px] text-muted-foreground'>
              {initial.template.path}
            </p>
          </div>
          <div className='flex flex-wrap gap-1.5'>
            <Button
              type='button'
              size='sm'
              variant='outline'
              onClick={() => void reload()}
              disabled={reloading || save.isPending || reset.isPending}
            >
              <RefreshCw className={reloading ? 'animate-spin' : ''} />
              重新读取
            </Button>
            <AlertDialog
              open={resetDialogOpen}
              onOpenChange={(open) => !reset.isPending && setResetDialogOpen(open)}
            >
              <AlertDialogTrigger asChild>
                <Button
                  type='button'
                  size='sm'
                  variant='outline'
                  disabled={
                    (initial.template.isDefault && !dirty) ||
                    reloading ||
                    save.isPending ||
                    reset.isPending
                  }
                >
                  <RotateCcw />
                  恢复默认
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>恢复默认报告模板？</AlertDialogTitle>
                  <AlertDialogDescription>
                    当前自定义内容会被内置默认模板替换，此操作不会自动创建备份。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={reset.isPending}>取消</AlertDialogCancel>
                  <AlertDialogAction onClick={restoreDefault} disabled={reset.isPending}>
                    {reset.isPending && <Loader2 className='animate-spin' />}
                    确认恢复
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button
              type='button'
              size='sm'
              onClick={() => save.mutate()}
              disabled={
                !dirty ||
                Boolean(previewError) ||
                reloading ||
                save.isPending ||
                reset.isPending
              }
            >
              {save.isPending ? <Loader2 className='animate-spin' /> : <Save />}
              保存模板
            </Button>
          </div>
        </div>
        <div className='space-y-3.5 p-4'>
          <div className='text-xs text-muted-foreground'>
            可用变量：<code className='rounded bg-muted px-1 py-0.5 font-mono text-[11px] text-foreground'>{'{{startDate}}'}</code>、
            <code className='rounded bg-muted px-1 py-0.5 font-mono text-[11px] text-foreground'>{'{{endDate}}'}</code>
            {cadence === 'custom' ? (
              <>
                、<code className='rounded bg-muted px-1 py-0.5 font-mono text-[11px] text-foreground'>{'{{reportTitle}}'}</code>、
                <code className='rounded bg-muted px-1 py-0.5 font-mono text-[11px] text-foreground'>{'{{dayCount}}'}</code>
              </>
            ) : null}
            。列出的变量都必须保留，其他变量不会被接受。
          </div>
          <Tabs defaultValue='edit'>
            <TabsList>
              <TabsTrigger value='edit'>编辑</TabsTrigger>
              <TabsTrigger value='preview'>预览</TabsTrigger>
            </TabsList>
            <TabsContent value='edit' className='mt-3'>
              <Textarea
                aria-label={`${getCadenceLabel(cadence)}模板内容`}
                value={content}
                onChange={(event) => setContent(event.target.value)}
                spellCheck={false}
                className='min-h-[520px] resize-y font-mono text-xs leading-6'
              />
            </TabsContent>
            <TabsContent value='preview' className='mt-3'>
              <div className='mb-2.5 font-mono text-xs text-muted-foreground tabular-nums'>
                示例周期：{period.start} 至 {period.end}
              </div>
              {previewError ? (
                <Alert variant='destructive'>
                  <AlertCircle />
                  <AlertTitle>模板无法预览</AlertTitle>
                  <AlertDescription>{previewError}</AlertDescription>
                </Alert>
              ) : (
                <div className='min-h-[520px] rounded-md border border-border bg-background p-5'>
                  <MarkdownViewer content={preview ?? ''} />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}

function setTemplateQueryData(
  queryClient: QueryClient,
  cadence: ReportType,
  period: Period,
  value: SummaryTemplateResult
) {
  queryClient.setQueryData(getTemplateQueryKey(cadence, period), value)
}

function showTemplateError(error: unknown) {
  if (error instanceof Error && error.message.includes('changed since')) {
    showErrorToast('模板已在其他位置修改，请重新读取后再保存。')
    return
  }
  showErrorToast(getErrorMessage(error))
}

function getExamplePeriod(cadence: ReportType): Period {
  const end = new Date()
  const start = new Date(end)
  if (cadence === 'weekly') {
    const day = start.getDay()
    start.setDate(start.getDate() - (day === 0 ? 6 : day - 1))
  } else if (cadence === 'monthly') {
    start.setDate(1)
  }
  return { start: formatDate(start), end: formatDate(end) }
}

const CADENCE_OPTIONS: Array<{ value: ReportType; label: string }> = [
  { value: 'daily', label: '日报' },
  { value: 'weekly', label: '周报' },
  { value: 'monthly', label: '月报' },
  { value: 'custom', label: '自定义报告' },
]

function getCadenceLabel(cadence: ReportType): string {
  return CADENCE_OPTIONS.find((option) => option.value === cadence)?.label ?? '周期报告'
}

function getTemplateQueryKey(cadence: ReportType, period: Period) {
  return ['summary-template', cadence, period.start, period.end] as const
}

function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function Loading() {
  return (
    <div className='flex items-center gap-2 rounded-lg border p-6 text-sm text-muted-foreground'>
      <Loader2 className='animate-spin' />
      正在读取报告模板…
    </div>
  )
}

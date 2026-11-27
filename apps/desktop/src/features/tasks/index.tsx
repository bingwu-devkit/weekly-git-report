import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CalendarClock, Edit, Loader2, MoreHorizontal, Play, Plus, Trash2 } from 'lucide-react'
import type { ReportCadence, ReportTask, ReportTaskMode } from '@weekly-git-report/shared'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { getErrorMessage } from '@/lib/errors'
import { showErrorToast, showSuccessToast } from '@/lib/toast'
import { cn } from '@/lib/utils'

export function Tasks() {
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState<ReportTask | null>()
  const state = useQuery({
    queryKey: ['tasks-state'],
    queryFn: () => window.electronAPI.tasks.state(),
  })
  const save = useMutation({
    mutationFn: async (tasks: ReportTask[]) => {
      if (!state.data) throw new Error('任务配置尚未读取。')
      return window.electronAPI.tasks.save({ version: 1, tasks }, state.data.revision)
    },
    onSuccess: (next) => {
      queryClient.setQueryData(['tasks-state'], next)
      void queryClient.invalidateQueries({ queryKey: ['desktop-overview'] })
      showSuccessToast('任务配置已保存')
    },
    onError: (error) => showErrorToast(getErrorMessage(error)),
  })
  const run = useMutation({
    mutationFn: (id: string) => window.electronAPI.tasks.run(id),
    onSuccess: (result) => {
      void queryClient.invalidateQueries({ queryKey: ['runs'] })
      showSuccessToast(
        result.status === 'awaiting_review'
          ? '报告草稿已生成，请前往执行记录审核'
          : '任务执行完成'
      )
    },
    onError: (error) => showErrorToast(getErrorMessage(error)),
  })

  function updateTask(task: ReportTask) {
    const tasks = state.data?.document.tasks ?? []
    save.mutate(
      tasks.some((item) => item.id === task.id)
        ? tasks.map((item) => (item.id === task.id ? task : item))
        : [...tasks, task]
    )
    setEditing(undefined)
  }

  const tasks = state.data?.document.tasks ?? []

  return (
    <>
      <Header>
        <div className='me-auto flex items-center gap-1.5 text-xs'>
          <span className='text-muted-foreground'>工作台</span>
          <span className='text-muted-foreground/50'>/</span>
          <span className='font-medium text-foreground'>报告任务</span>
          {state.data ? (
            <span className='ms-1.5 font-mono text-[11px] text-muted-foreground tabular-nums'>
              {tasks.filter((item) => item.enabled).length}/{tasks.length}
            </span>
          ) : null}
        </div>
        <Button size='sm' onClick={() => setEditing(null)}>
          <Plus />
          新建任务
        </Button>
      </Header>

      <Main className='space-y-4'>
        <div>
          <h1 className='text-lg font-semibold tracking-[-0.02em]'>报告任务</h1>
          <p className='mt-0.5 text-xs text-muted-foreground'>
            按本地时间定时生成日报、周报或月报，也可以立即执行。
          </p>
        </div>

        {tasks.length > 0 && (
          <div className='divide-y divide-border/70 overflow-hidden rounded-lg border border-border bg-card'>
            {tasks.map((task) => {
              const running = run.isPending && run.variables === task.id
              return (
                <div
                  key={task.id}
                  className='flex flex-wrap items-center justify-between gap-3 px-4 py-3 transition-colors duration-100 hover:bg-accent/35'
                >
                  <div className='flex min-w-0 flex-1 items-start gap-2.5'>
                    <span
                      className={cn(
                        'mt-1.5 size-1.5 shrink-0 rounded-full',
                        task.enabled ? 'bg-emerald-500' : 'bg-muted-foreground/35'
                      )}
                    />
                    <div className='min-w-0 flex-1'>
                      <div className='flex flex-wrap items-center gap-2'>
                        <span className='truncate text-[13.5px] font-medium text-foreground'>
                          {task.name}
                        </span>
                        <Badge variant='outline'>{cadenceLabel(task.cadence)}</Badge>
                        {task.publishToFeishu && <Badge variant='secondary'>飞书</Badge>}
                      </div>
                      <p className='mt-0.5 text-xs text-muted-foreground tabular-nums'>
                        {scheduleLabel(task)} · {task.mode === 'draft' ? '生成后审核' : '自动保存'}
                      </p>
                    </div>
                  </div>

                  <div className='flex shrink-0 items-center gap-2.5'>
                    <Button
                      size='sm'
                      variant='ghost'
                      disabled={running}
                      onClick={() => run.mutate(task.id)}
                    >
                      {running ? <Loader2 className='animate-spin' /> : <Play />}
                      立即运行
                    </Button>
                    <div className='flex items-center gap-2 border-s border-border/70 ps-2.5'>
                      <span className='w-10 text-end text-xs text-muted-foreground'>
                        {task.enabled ? '启用' : '停用'}
                      </span>
                      <Switch
                        checked={task.enabled}
                        disabled={save.isPending}
                        onCheckedChange={(enabled) =>
                          save.mutate(
                            tasks.map((item) =>
                              item.id === task.id
                                ? { ...item, enabled, updatedAt: new Date().toISOString() }
                                : item
                            )
                          )
                        }
                      />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size='icon' variant='ghost' className='size-7'>
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem onSelect={() => setEditing(task)}>
                          <Edit />
                          编辑任务
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => run.mutate(task.id)}>
                          <Play />
                          立即运行
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant='destructive'
                          onSelect={() =>
                            save.mutate(tasks.filter((item) => item.id !== task.id))
                          }
                        >
                          <Trash2 />
                          删除任务
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {state.isLoading && (
          <p className='flex items-center gap-2 text-xs text-muted-foreground'>
            <Loader2 className='size-3.5 animate-spin' />
            正在读取任务…
          </p>
        )}

        {state.data?.document.tasks.length === 0 && (
          <div className='flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-14 text-center'>
            <CalendarClock className='size-6 text-muted-foreground/70' />
            <p className='mt-2.5 text-sm font-medium text-foreground'>还没有报告任务</p>
            <p className='mt-1 text-xs text-muted-foreground'>
              先配置 AI 服务，然后创建日报、周报或月报任务。
            </p>
          </div>
        )}
      </Main>

      {editing !== undefined && (
        <TaskDialog
          task={editing}
          open
          onOpenChange={(open) => !open && setEditing(undefined)}
          onSave={updateTask}
        />
      )}
    </>
  )
}

function TaskDialog({
  task,
  open,
  onOpenChange,
  onSave,
}: {
  task: ReportTask | null
  open: boolean
  onOpenChange(open: boolean): void
  onSave(task: ReportTask): void
}) {
  const [name, setName] = useState(task?.name ?? '')
  const [cadence, setCadence] = useState<ReportCadence>(task?.cadence ?? 'weekly')
  const [mode, setMode] = useState<ReportTaskMode>(task?.mode ?? 'draft')
  const [hour, setHour] = useState(task?.schedule.hour ?? 18)
  const [minute, setMinute] = useState(task?.schedule.minute ?? 0)
  const [includeWeekends, setIncludeWeekends] = useState(task?.schedule.includeWeekends ?? false)
  const [publish, setPublish] = useState(task?.publishToFeishu ?? false)

  function submit() {
    const now = new Date().toISOString()
    onSave({
      id: task?.id ?? crypto.randomUUID(),
      name: name.trim() || `${cadenceLabel(cadence)}任务`,
      cadence,
      enabled: task?.enabled ?? false,
      mode,
      publishToFeishu: publish,
      projectIds: task?.projectIds ?? [],
      schedule: { hour, minute, includeWeekends },
      createdAt: task?.createdAt ?? now,
      updatedAt: now,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? '编辑任务' : '新建任务'}</DialogTitle>
          <DialogDescription>
            应用会将任务添加到系统计划中，到达设定时间后自动执行。
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-3.5'>
          <div className='space-y-1.5'>
            <Label className='text-xs'>任务名称</Label>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={`${cadenceLabel(cadence)}任务`}
            />
          </div>
          <div className='grid gap-3 sm:grid-cols-2'>
            <div className='space-y-1.5'>
              <Label className='text-xs'>报告周期</Label>
              <Select value={cadence} onValueChange={(value) => setCadence(value as ReportCadence)}>
                <SelectTrigger className='w-full'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='daily'>日报</SelectItem>
                  <SelectItem value='weekly'>周报</SelectItem>
                  <SelectItem value='monthly'>月报</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-1.5'>
              <Label className='text-xs'>保存方式</Label>
              <Select value={mode} onValueChange={(value) => setMode(value as ReportTaskMode)}>
                <SelectTrigger className='w-full'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='draft'>生成草稿，审核后保存</SelectItem>
                  <SelectItem value='autoPublish'>生成后自动保存</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className='grid gap-3 sm:grid-cols-2'>
            <div className='space-y-1.5'>
              <Label className='text-xs'>小时</Label>
              <Input
                type='number'
                min={0}
                max={23}
                className='font-mono tabular-nums'
                value={hour}
                onChange={(event) => setHour(Number(event.target.value))}
              />
            </div>
            <div className='space-y-1.5'>
              <Label className='text-xs'>分钟</Label>
              <Input
                type='number'
                min={0}
                max={59}
                className='font-mono tabular-nums'
                value={minute}
                onChange={(event) => setMinute(Number(event.target.value))}
              />
            </div>
          </div>
          <div className='divide-y divide-border/70 rounded-md border border-border'>
            {cadence === 'daily' && (
              <label className='flex items-center justify-between px-3 py-2.5 text-[13px]'>
                <span>周末也生成日报</span>
                <Switch checked={includeWeekends} onCheckedChange={setIncludeWeekends} />
              </label>
            )}
            <label className='flex items-center justify-between px-3 py-2.5 text-[13px]'>
              <span>保存后推送飞书</span>
              <Switch checked={publish} onCheckedChange={setPublish} />
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={submit}>保存任务</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function cadenceLabel(cadence: ReportCadence) {
  return cadence === 'daily' ? '日报' : cadence === 'weekly' ? '周报' : '月报'
}

function scheduleLabel(task: ReportTask) {
  const time = `${String(task.schedule.hour).padStart(2, '0')}:${String(task.schedule.minute).padStart(2, '0')}`
  if (task.cadence === 'daily') return `${task.schedule.includeWeekends ? '每天' : '每个工作日'} ${time} · 生成当天`
  if (task.cadence === 'weekly') return `每周一 ${time} · 生成上一完整周`
  return `每月 1 日 ${time} · 生成上一完整月`
}

import { useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import type { z } from 'zod'
import { ChevronDown, FolderSearch, Loader2, Plus, Trash2 } from 'lucide-react'
import { ConfigSchema } from '@weekly-git-report/shared'
import type { Config } from '@weekly-git-report/shared'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { selectSystemDirectory } from '@/lib/system-actions'

export type ConfigFormInput = z.input<typeof ConfigSchema>

export function ConfigFormFields({
  compact = false,
  cacheEditable = false,
}: {
  compact?: boolean
  cacheEditable?: boolean
}) {
  const form = useFormContext<ConfigFormInput, unknown, Config>()
  const identities = useFieldArray({ control: form.control, name: 'identities' })
  const [selectingOutput, setSelectingOutput] = useState(false)
  const [selectingCache, setSelectingCache] = useState(false)
  const [advancedOpen, setAdvancedOpen] = useState(false)

  async function selectOutputDirectory() {
    setSelectingOutput(true)
    try {
      const selected = await selectSystemDirectory(form.getValues('outputRoot'))
      if (selected) {
        form.setValue('outputRoot', selected, { shouldDirty: true, shouldValidate: true })
      }
    } finally {
      setSelectingOutput(false)
    }
  }

  async function selectCacheDirectory() {
    setSelectingCache(true)
    try {
      const selected = await selectSystemDirectory(form.getValues('repositoryCacheRoot'))
      if (selected) {
        form.setValue('repositoryCacheRoot', selected, { shouldDirty: true, shouldValidate: true })
      }
    } finally {
      setSelectingCache(false)
    }
  }

  const outputField = (
    <FormField
      control={form.control}
      name='outputRoot'
      render={({ field }) => (
        <FormItem>
          <FormLabel className='text-xs'>报告输出目录</FormLabel>
          <div className='flex gap-2'>
            <FormControl>
              <Input {...field} className='font-mono text-xs' />
            </FormControl>
            <Button
              type='button'
              variant='outline'
              onClick={() => void selectOutputDirectory()}
              disabled={selectingOutput}
            >
              {selectingOutput ? <Loader2 className='animate-spin' /> : <FolderSearch />}
              选择
            </Button>
          </div>
          <FormDescription className='text-xs'>
            可以选择文件夹，也可以直接输入完整路径。
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )

  const cacheField = (
    <FormField
      control={form.control}
      name='repositoryCacheRoot'
      render={({ field }) => (
        <FormItem>
          <FormLabel className='text-xs'>仓库缓存目录</FormLabel>
          <div className='flex gap-2'>
            <FormControl>
              <Input
                {...field}
                readOnly={!cacheEditable}
                className={cacheEditable ? 'font-mono text-xs' : 'bg-muted/40 font-mono text-xs text-muted-foreground'}
              />
            </FormControl>
            {cacheEditable ? (
              <Button
                type='button'
                variant='outline'
                onClick={() => void selectCacheDirectory()}
                disabled={selectingCache}
              >
                {selectingCache ? <Loader2 className='animate-spin' /> : <FolderSearch />}
                选择
              </Button>
            ) : null}
          </div>
          <FormDescription className='text-xs'>
            用于保存本地仓库缓存。
            {cacheEditable ? ' 完成首次设置后不能在桌面端修改。' : ' 此目录不能在桌面端修改。'}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )

  const includeEmptyField = (
    <FormField
      control={form.control}
      name='includeEmptyProjects'
      render={({ field }) => (
        <FormItem className='flex items-center justify-between gap-4 rounded-md border border-border bg-card px-3.5 py-3'>
          <div>
            <FormLabel className='text-[13px] font-medium'>显示无提交仓库</FormLabel>
            <FormDescription className='text-xs'>
              在报告中显示当前周期没有匹配提交的已启用仓库。
            </FormDescription>
          </div>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  )

  return (
    <div className='divide-y divide-border/80'>
      <section className='space-y-4 pb-6'>
        <div>
          <h2 className='text-[13.5px] font-medium text-foreground'>目录</h2>
          <p className='mt-0.5 text-xs text-muted-foreground'>
            修改目录只影响后续生成内容，不会迁移已有报告或仓库。
          </p>
        </div>
        <div className='space-y-4'>
          {outputField}
          {!compact && cacheField}
        </div>
      </section>

      <section className='py-6'>
        <IdentityFields
          fields={identities.fields}
          append={identities.append}
          remove={identities.remove}
        />
      </section>

      {compact ? (
        <section className='pt-6'>
          <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
            <CollapsibleTrigger asChild>
              <button
                type='button'
                className='flex w-full items-center justify-between text-start'
              >
                <div>
                  <h2 className='text-[13.5px] font-medium text-foreground'>高级设置</h2>
                  <p className='mt-0.5 text-xs text-muted-foreground'>
                    缓存目录和无提交仓库规则。
                  </p>
                </div>
                <ChevronDown
                  className={
                    advancedOpen
                      ? 'size-4 rotate-180 text-muted-foreground transition-transform duration-150'
                      : 'size-4 text-muted-foreground transition-transform duration-150'
                  }
                />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className='space-y-4 pt-4'>
              {cacheField}
              {includeEmptyField}
            </CollapsibleContent>
          </Collapsible>
        </section>
      ) : (
        <section className='space-y-3 pt-6'>
          <h2 className='text-[13.5px] font-medium text-foreground'>采集规则</h2>
          {includeEmptyField}
        </section>
      )}
    </div>
  )
}

function IdentityFields({
  fields,
  append,
  remove,
}: {
  fields: Array<{ id: string }>
  append(value: { name: string; email: string }): void
  remove(index: number): void
}) {
  const form = useFormContext<ConfigFormInput, unknown, Config>()
  return (
    <div className='space-y-3.5'>
      <div className='flex items-start justify-between gap-3'>
        <div>
          <h2 className='text-[13.5px] font-medium text-foreground'>Git 作者身份</h2>
          <p className='mt-0.5 text-xs text-muted-foreground'>
            采集时只保留匹配这些姓名或邮箱的提交。
          </p>
        </div>
        <Button
          type='button'
          size='sm'
          variant='outline'
          onClick={() => append({ name: '', email: '' })}
        >
          <Plus />
          添加身份
        </Button>
      </div>
      <div className='space-y-2.5'>
        {fields.map((identity, index) => (
          <div
            key={identity.id}
            className='grid gap-3 rounded-md border border-border bg-card p-3 sm:grid-cols-[1fr_1fr_auto]'
          >
            <FormField
              control={form.control}
              name={`identities.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-xs'>姓名</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`identities.${index}.email`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-xs'>邮箱</FormLabel>
                  <FormControl>
                    <Input type='email' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type='button'
              size='icon'
              variant='ghost'
              className='self-end'
              disabled={fields.length === 1}
              onClick={() => remove(index)}
              aria-label='删除身份'
            >
              <Trash2 />
            </Button>
          </div>
        ))}
        {fields.length === 0 && (
          <Button type='button' variant='outline' onClick={() => append({ name: '', email: '' })}>
            <Plus />
            添加第一个身份
          </Button>
        )}
      </div>
    </div>
  )
}

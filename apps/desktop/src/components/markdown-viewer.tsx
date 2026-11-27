import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'

type MarkdownViewerProps = {
  content: string
  className?: string
}

export function MarkdownViewer({ content, className }: MarkdownViewerProps) {
  return (
    <article
      className={cn(
        'min-w-0 break-words text-[13.5px] leading-[1.7] text-foreground/95',
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className='mb-4 border-b border-border/70 pb-2.5 text-xl font-semibold tracking-[-0.02em] text-foreground'>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className='mt-6 mb-2.5 text-base font-semibold tracking-[-0.015em] text-foreground'>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className='mt-5 mb-2 text-sm font-semibold tracking-[-0.01em] text-foreground'>
              {children}
            </h3>
          ),
          p: ({ children }) => <p className='my-2.5 text-foreground/90'>{children}</p>,
          ul: ({ children }) => (
            <ul className='my-2.5 list-disc space-y-1 ps-5 text-foreground/90'>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className='my-2.5 list-decimal space-y-1 ps-5 text-foreground/90'>
              {children}
            </ol>
          ),
          li: ({ children }) => <li className='leading-[1.65]'>{children}</li>,
          hr: () => <hr className='my-5 border-border/70' />,
          blockquote: ({ children }) => (
            <blockquote className='my-3.5 border-s-2 border-primary/50 bg-muted/30 py-1 ps-3.5 text-muted-foreground'>
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className='my-4 overflow-x-auto rounded-md border border-border'>
              <table className='w-full border-collapse text-start text-[13px]'>
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className='border-b border-border bg-muted/50 px-3 py-2 text-xs font-medium text-muted-foreground'>
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className='border-b border-border/60 px-3 py-2 align-top'>
              {children}
            </td>
          ),
          code: ({ children, className: codeClassName }) =>
            codeClassName ? (
              <code className={cn('font-mono text-xs', codeClassName)}>{children}</code>
            ) : (
              <code className='rounded border border-border/70 bg-muted/70 px-1.5 py-0.5 font-mono text-[12px] text-foreground'>
                {children}
              </code>
            ),
          pre: ({ children }) => (
            <pre className='my-3.5 overflow-x-auto rounded-md border border-border bg-muted/45 p-3.5 font-mono text-xs leading-6'>
              {children}
            </pre>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              target='_blank'
              rel='noreferrer'
              className='text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary'
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  )
}

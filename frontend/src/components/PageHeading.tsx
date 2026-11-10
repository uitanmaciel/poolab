import type { ReactNode } from 'react'

interface PageHeadingProps {
  title: string
  description?: ReactNode
  action?: ReactNode
  align?: 'start' | 'center'
}

export function PageHeading({ title, description, action, align = 'start' }: PageHeadingProps) {
  return (
    <div
      className={
        align === 'center'
          ? 'flex flex-col items-center gap-3 text-center'
          : 'flex flex-col gap-3 md:flex-row md:items-end md:justify-between'
      }
    >
      <div className="flex flex-col gap-1.5">
        <h1 className="font-display text-[28px] font-bold leading-tight tracking-tight md:text-[32px]">{title}</h1>
        {description ? <p className="text-[15px] text-muted-foreground">{description}</p> : null}
      </div>
      {action ? <div className="flex-none">{action}</div> : null}
    </div>
  )
}

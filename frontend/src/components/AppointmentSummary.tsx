import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface SummaryRow {
  label: string
  value: ReactNode
  /** Valor antigo, riscado (ex.: horário anterior no reagendamento). */
  struck?: boolean
  /** Código do agendamento, em fonte monoespaçada. */
  mono?: boolean
}

/** Resumo em linhas (revisão, confirmação, cancelamento). */
export function AppointmentSummary({ rows, className }: { rows: SummaryRow[]; className?: string }) {
  return (
    <dl className={cn('w-full divide-y divide-border rounded-2xl border-[1.5px] border-border bg-card px-5', className)}>
      {rows.map((row) => (
        <div key={row.label} className="flex items-start justify-between gap-4 py-3 text-[15px]">
          <dt className="text-muted-foreground">{row.label}</dt>
          <dd
            className={cn(
              'text-right font-semibold',
              row.mono && 'font-mono',
              row.struck && 'text-muted-foreground line-through',
            )}
          >
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}

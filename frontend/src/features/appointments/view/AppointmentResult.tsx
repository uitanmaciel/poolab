import type { ReactNode } from 'react'
import { Check, TriangleAlert, X } from 'lucide-react'
import { AppointmentSummary, type SummaryRow } from '@/components/AppointmentSummary'
import { ErrorAlert } from '@/components/ErrorAlert'
import { cn } from '@/lib/utils'

type ResultTone = 'success' | 'error' | 'warning'

const ICONS = { success: Check, error: X, warning: TriangleAlert } as const
const ICON_CLASSES: Record<ResultTone, string> = {
  success: 'bg-success-soft text-success border-success',
  error: 'bg-error-soft text-error border-error',
  warning: 'bg-warning-soft text-warning border-warning',
}

interface AppointmentResultProps {
  tone: ResultTone
  title: string
  description: string
  /** Mensagem de alerta abaixo do título (ex.: "Nada foi alterado."). */
  notice?: { title: string; text: string }
  code?: { label: string; value: string; struck?: boolean }
  rows: SummaryRow[]
  actions: ReactNode
}

/**
 * Tela de resultado de agendamento: sucesso (cancelado, reagendado) ou erro de regra (já cancelado, não editável).
 */
export function AppointmentResult({ tone, title, description, notice, code, rows, actions }: AppointmentResultProps) {
  const Icon = ICONS[tone]
  return (
    <div role="status" className="mx-auto flex w-full max-w-[640px] flex-col items-center gap-5 pt-6 text-center md:pt-12">
      <span className={cn('flex size-16 items-center justify-center rounded-full border-2', ICON_CLASSES[tone])}>
        <Icon aria-hidden="true" className="size-8" strokeWidth={2.5} />
      </span>
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-[28px] font-bold leading-tight tracking-tight md:text-[34px]">{title}</h1>
        <p className="text-[15px] text-muted-foreground">{description}</p>
      </div>
      {notice ? (
        <ErrorAlert tone={tone === 'error' ? 'error' : 'warning'} title={notice.title} className="w-full text-left">
          {notice.text}
        </ErrorAlert>
      ) : null}
      {code ? (
        <div className="w-full rounded-2xl border-2 border-primary bg-card px-6 py-4 shadow-sm">
          <p className="text-[13px] text-muted-foreground">{code.label}</p>
          <p className={cn('font-mono text-[28px] font-medium tracking-[0.04em]', code.struck && 'text-muted-foreground line-through')}>
            {code.value}
          </p>
        </div>
      ) : null}
      <AppointmentSummary rows={rows} className="text-left" />
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">{actions}</div>
    </div>
  )
}

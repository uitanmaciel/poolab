import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorAlert } from './ErrorAlert'

/** Carregando: esqueleto com texto para leitores de tela. */
export function LoadingState({ label = 'Carregando…', lines = 3 }: { label?: string; lines?: number }) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col gap-3">
      <span className="sr-only">{label}</span>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton key={index} className="h-14 w-full rounded-xl" />
      ))}
    </div>
  )
}

/** Erro de carregamento com ação de tentar de novo. */
export function LoadErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col gap-3">
      <ErrorAlert title="Não foi possível carregar">{message}</ErrorAlert>
      <Button variant="outline" className="w-fit" onClick={onRetry}>
        Tentar de novo
      </Button>
    </div>
  )
}

/** Estado vazio com título, texto e ação opcional. */
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border-[1.5px] border-dashed border-border bg-card px-6 py-14 text-center">
      <span aria-hidden="true" className="flex size-[72px] items-center justify-center rounded-full bg-primary-soft text-primary">
        {icon}
      </span>
      <h2 className="font-display text-2xl font-bold">{title}</h2>
      <p className="max-w-[460px] text-[15px] text-muted-foreground">{description}</p>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  )
}

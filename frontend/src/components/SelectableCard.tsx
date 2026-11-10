import { Check, Ban } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SelectableCardProps {
  selected: boolean
  disabled?: boolean
  onSelect: () => void
  /** Conteúdo do avatar (ex.: "P", "MS"). */
  avatar: ReactNode
  title: string
  description?: string
  /** Badge de contexto (ex.: "Sem horários"). Sempre com texto. */
  badge?: { label: string; tone: 'primary' | 'success' | 'warning' | 'neutral' }
  disabledReason?: string
  className?: string
}

const BADGE_TONES = {
  primary: 'bg-primary-soft text-primary',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  neutral: 'bg-secondary text-muted-foreground',
} as const

/**
 * Cartão de escolha de um item (tipo de atendimento, responsável).
 * Seleção comunicada por borda, ícone e texto; desabilitado com motivo visível.
 */
export function SelectableCard({
  selected,
  disabled = false,
  onSelect,
  avatar,
  title,
  description,
  badge,
  disabledReason,
  className,
}: SelectableCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        // Layout do design Doop (Web 02): topo com avatar à esquerda e indicador à direita; conteúdo abaixo.
        'flex w-full flex-col gap-4 rounded-2xl border-[1.5px] border-border bg-card p-5 text-left shadow-sm transition-colors',
        'focus-visible:outline-3 focus-visible:outline-ring/50 focus-visible:outline-offset-2',
        !disabled && 'hover:border-primary',
        selected && 'border-2 border-primary bg-primary-soft',
        disabled && 'cursor-not-allowed border-dashed bg-secondary shadow-none',
        className,
      )}
    >
      <span className="flex items-start justify-between gap-3">
        <span
          aria-hidden="true"
          className={cn(
            'flex size-12 flex-none items-center justify-center rounded-xl font-display text-lg font-bold',
            selected ? 'bg-primary text-primary-foreground' : 'bg-primary-soft text-primary',
            disabled && 'bg-border text-muted-foreground',
          )}
        >
          {avatar}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            'flex size-6 flex-none items-center justify-center rounded-full border-2',
            selected ? 'border-primary bg-primary text-primary-foreground' : 'border-border',
          )}
        >
          {selected ? <Check className="size-3.5" strokeWidth={3} /> : null}
        </span>
      </span>

      <span className="flex min-w-0 flex-col gap-1">
        <span className={cn('font-display text-xl font-bold leading-tight', disabled && 'text-muted-foreground')}>
          {title}
        </span>
        {description ? <span className="text-sm text-muted-foreground">{description}</span> : null}
        {badge ? (
          <span className={cn('mt-2 inline-flex h-[26px] w-fit items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold', BADGE_TONES[badge.tone])}>
            {badge.label}
          </span>
        ) : null}
        {disabled && disabledReason ? (
          <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <Ban aria-hidden="true" className="size-3.5" />
            {disabledReason}
          </span>
        ) : null}
      </span>
    </button>
  )
}

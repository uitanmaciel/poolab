import { Check, Circle, Clock, X } from 'lucide-react'
import type { AppointmentStatusView, StatusIcon } from '@/features/appointments/model/status'
import { cn } from '@/lib/utils'

const ICONS: Record<StatusIcon, typeof Check> = { check: Check, cross: X, clock: Clock, dot: Circle }

const TONE_CLASSES = {
  success: 'bg-success-soft text-success',
  error: 'bg-error-soft text-error',
  primary: 'bg-primary-soft text-primary',
  neutral: 'bg-secondary text-muted-foreground',
} as const

/** Status com ícone e texto, nunca só cor. */
export function StatusBadge({ view, className }: { view: AppointmentStatusView; className?: string }) {
  const Icon = ICONS[view.icon]
  return (
    <span
      className={cn(
        'inline-flex h-6 w-fit flex-none items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold',
        TONE_CLASSES[view.tone],
        className,
      )}
    >
      <Icon aria-hidden="true" className="size-3.5" strokeWidth={3} />
      {view.label}
    </span>
  )
}

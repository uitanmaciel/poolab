import { CircleCheck, CircleAlert, TriangleAlert, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { cn } from '@/lib/utils'

type AlertTone = 'error' | 'warning' | 'success' | 'info'

const TONES: Record<AlertTone, { icon: LucideIcon; className: string; iconClass: string }> = {
  error: {
    icon: CircleAlert,
    className: 'border-l-error bg-error-soft text-foreground',
    iconClass: 'text-error',
  },
  warning: {
    icon: TriangleAlert,
    className: 'border-l-warning bg-warning-soft text-foreground',
    iconClass: 'text-warning',
  },
  success: {
    icon: CircleCheck,
    className: 'border-l-success bg-success-soft text-foreground',
    iconClass: 'text-success',
  },
  info: {
    icon: CircleAlert,
    className: 'border-l-primary bg-primary-soft text-foreground',
    iconClass: 'text-primary',
  },
}

interface ErrorAlertProps {
  tone?: AlertTone
  title: string
  children?: ReactNode
  className?: string
}

/** Mensagem de estado com ícone e texto, nunca só cor (RNF). Erros são anunciados como alerta. */
export function ErrorAlert({ tone = 'error', title, children, className }: ErrorAlertProps) {
  const config = TONES[tone]
  const Icon = config.icon
  return (
    <Alert
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn('border-l-4 border-y-0 border-r-0 rounded-lg', config.className, className)}
    >
      <Icon aria-hidden="true" className={cn('mt-0.5', config.iconClass)} />
      <div>
        <AlertTitle className="font-display text-base font-bold">{title}</AlertTitle>
        {children ? <AlertDescription className="text-sm text-muted-foreground">{children}</AlertDescription> : null}
      </div>
    </Alert>
  )
}

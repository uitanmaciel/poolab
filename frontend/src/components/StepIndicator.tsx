import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface StepItem {
  id: string
  label: string
}

interface StepIndicatorProps {
  steps: StepItem[]
  /** Índice do passo atual (0-based). */
  currentIndex: number
}

/** Desktop: círculos com rótulos. Mobile: "Passo X de N" com barras. Ambos com texto, não só cor. */
export function StepIndicator({ steps, currentIndex }: StepIndicatorProps) {
  const current = steps[currentIndex]

  return (
    <nav aria-label="Etapas do agendamento">
      <ol className="hidden items-center gap-2 md:flex">
        {steps.map((step, index) => {
          const done = index < currentIndex
          const active = index === currentIndex
          return (
            <li key={step.id} className="flex items-center gap-2" aria-current={active ? 'step' : undefined}>
              <span
                className={cn(
                  'flex size-7 flex-none items-center justify-center rounded-full border-2 text-[13px] font-semibold',
                  done && 'border-primary bg-primary text-primary-foreground',
                  active && 'border-primary text-primary ring-[3px] ring-primary-soft',
                  !done && !active && 'border-border text-muted-foreground',
                )}
              >
                {done ? <Check aria-label="concluído" className="size-3.5" strokeWidth={3} /> : index + 1}
              </span>
              <span className={cn('text-[13px] font-semibold', active ? 'text-foreground' : 'text-muted-foreground')}>
                {step.label}
              </span>
              {index < steps.length - 1 ? <span aria-hidden="true" className="mx-1 h-0.5 w-8 rounded bg-border" /> : null}
            </li>
          )
        })}
      </ol>

      <div className="md:hidden">
        <p className="text-[13px] font-semibold text-muted-foreground">
          Passo {currentIndex + 1} de {steps.length}
          {current ? <span className="text-foreground"> · {current.label}</span> : null}
        </p>
        <div className="mt-1.5 flex gap-1.5" aria-hidden="true">
          {steps.map((step, index) => (
            <span
              key={step.id}
              className={cn('h-1.5 flex-1 rounded-full bg-border', index <= currentIndex && 'bg-primary')}
            />
          ))}
        </div>
      </div>
    </nav>
  )
}

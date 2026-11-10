import { Check } from 'lucide-react'
import type { SlotDay } from '@/features/slots/model/slotDays'
import { cn } from '@/lib/utils'

interface DayStripProps {
  days: SlotDay[]
  selectedKey: string | null
  onSelect: (key: string) => void
}

/** Faixa de dias da janela. Dia sem vaga aparece desabilitado com o texto "sem vagas". */
export function DayStrip({ days, selectedKey, onSelect }: DayStripProps) {
  return (
    <div role="radiogroup" aria-label="Dias disponíveis" className="-mx-1 flex gap-2.5 overflow-x-auto px-1 pb-1">
      {days.map((day) => {
        const selected = day.key === selectedKey
        const noSlots = day.availableCount === 0
        return (
          <button
            key={day.key}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-disabled={noSlots || undefined}
            disabled={noSlots}
            onClick={() => onSelect(day.key)}
            className={cn(
              'flex w-[88px] flex-none flex-col items-center gap-0.5 rounded-xl border-[1.5px] border-border bg-card px-2 py-2.5 text-center text-[13px] text-muted-foreground transition-colors md:w-24',
              'focus-visible:outline-3 focus-visible:outline-ring/50 focus-visible:outline-offset-2',
              !noSlots && 'hover:border-primary',
              selected && 'border-2 border-primary bg-primary-soft text-primary',
              noSlots && 'border-dashed bg-secondary',
            )}
          >
            <span className="capitalize">{day.weekday}</span>
            <span className={cn('font-display text-[22px] font-bold leading-tight text-foreground', selected && 'text-primary', noSlots && 'text-muted-foreground line-through')}>
              {day.dayNumber}
            </span>
            <span className="inline-flex items-center gap-1 text-xs">
              {selected ? <Check aria-hidden="true" className="size-3" strokeWidth={3} /> : null}
              {noSlots ? 'sem vagas' : `${day.availableCount} ${day.availableCount === 1 ? 'vaga' : 'vagas'}`}
            </span>
          </button>
        )
      })}
    </div>
  )
}

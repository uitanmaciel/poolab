import { Check, X } from 'lucide-react'
import { formatTime } from '@/lib/datetime'
import { cn } from '@/lib/utils'
import type { Slot } from '@/features/slots/model/types'

interface SlotGridProps {
  slots: Slot[]
  selectedId: string | null
  onSelect: (slot: Slot) => void
}

/**
 * Horários do dia. Livre: borda cheia. Selecionado: preenchido com ✓. Indisponível: tracejado, riscado e ✕.
 * Indisponíveis não são selecionáveis.
 */
export function SlotGrid({ slots, selectedId, onSelect }: SlotGridProps) {
  if (slots.length === 0) {
    return <p className="text-sm text-muted-foreground">Nenhum horário neste dia.</p>
  }

  return (
    <div role="radiogroup" aria-label="Horários disponíveis" className="flex flex-wrap gap-2.5">
      {slots.map((slot) => {
        const selected = slot.id === selectedId
        const time = formatTime(slot.startsAt)
        if (!slot.available) {
          return (
            <button
              key={slot.id}
              type="button"
              role="radio"
              aria-checked={false}
              aria-disabled="true"
              disabled
              className="inline-flex h-11 min-w-[92px] items-center justify-center gap-1.5 rounded-[10px] border-[1.5px] border-dashed border-border bg-secondary px-3.5 font-mono text-[15px] font-medium text-muted-foreground line-through"
            >
              {time}
              <X aria-hidden="true" className="size-3.5" />
              <span className="sr-only">indisponível</span>
            </button>
          )
        }
        return (
          <button
            key={slot.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onSelect(slot)}
            className={cn(
              'inline-flex h-11 min-w-[92px] items-center justify-center gap-1.5 rounded-[10px] border-[1.5px] border-border bg-card px-3.5 font-mono text-[15px] font-semibold text-foreground transition-colors hover:border-primary',
              'focus-visible:outline-3 focus-visible:outline-ring/50 focus-visible:outline-offset-2',
              selected && 'border-primary bg-primary text-primary-foreground hover:bg-primary-hover',
            )}
          >
            {selected ? <Check aria-hidden="true" className="size-4" strokeWidth={3} /> : null}
            {time}
            {selected ? <span className="sr-only">selecionado</span> : null}
          </button>
        )
      })}
    </div>
  )
}

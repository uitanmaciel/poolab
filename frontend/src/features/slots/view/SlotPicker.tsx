import { Check } from 'lucide-react'
import { DayStrip } from '@/components/DayStrip'
import { LoadErrorState, LoadingState } from '@/components/StateMessage'
import { SlotGrid } from '@/components/SlotGrid'
import { formatTime } from '@/lib/datetime'
import type { SlotDay } from '../model/slotDays'
import type { Slot } from '../model/types'
import type { SlotsStatus } from '../viewmodel/useSlotsViewModel'

interface SlotPickerProps {
  status: SlotsStatus
  error: string | null
  days: SlotDay[]
  selectedDayKey: string | null
  selectedDay: SlotDay | null
  onSelectDay: (key: string) => void
  selectedSlot: Slot | null
  onSelectSlot: (slot: Slot) => void
  onRetry: () => void
  /** Texto de contexto acima dos dias (ex.: nome do responsável). */
  heading?: string
}

/** Escolha de dia e horário com legenda textual (livre, selecionado, indisponível). */
export function SlotPicker({
  status,
  error,
  days,
  selectedDayKey,
  selectedDay,
  onSelectDay,
  selectedSlot,
  onSelectSlot,
  onRetry,
}: SlotPickerProps) {
  if (status === 'loading') return <LoadingState label="Carregando horários" lines={3} />
  if (status === 'error') return <LoadErrorState message={error ?? 'Tente novamente.'} onRetry={onRetry} />
  if (days.length === 0) {
    return <p className="text-sm text-muted-foreground">Não há horários nos próximos 14 dias.</p>
  }

  return (
    <div className="flex flex-col gap-6">
      <section aria-labelledby="dias-titulo" className="flex flex-col gap-3">
        <h2 id="dias-titulo" className="font-display text-lg font-bold">
          Dia
        </h2>
        <DayStrip days={days} selectedKey={selectedDayKey} onSelect={onSelectDay} />
      </section>

      <section aria-labelledby="horarios-titulo" className="flex flex-col gap-3">
        <h2 id="horarios-titulo" className="font-display text-lg font-bold">
          {selectedDay ? `Horários de ${selectedDay.weekday}, ${selectedDay.dayNumber} de ${selectedDay.monthShort}` : 'Horários'}
        </h2>
        <SlotGrid
          slots={selectedDay?.slots ?? []}
          selectedId={selectedSlot?.id ?? null}
          onSelect={onSelectSlot}
        />
        <p className="text-[13px] text-muted-foreground">
          Livre: borda cheia. Selecionado: preenchido com ✓. Indisponível: tracejado, riscado e com ✕. Cada atendimento dura 30 min.
        </p>
      </section>

      {selectedSlot ? (
        <p className="inline-flex w-fit items-center gap-2 rounded-xl border-[1.5px] border-primary bg-card px-4 py-2.5 text-sm">
          <Check aria-hidden="true" className="size-4 text-primary" strokeWidth={3} />
          Você escolheu <span className="font-semibold">{formatTime(selectedSlot.startsAt)}</span> (30 min)
        </p>
      ) : (
        <p className="inline-flex w-fit rounded-xl border-[1.5px] border-border bg-secondary px-4 py-2.5 text-sm text-muted-foreground">
          Nenhum horário selecionado. Escolha um horário para continuar.
        </p>
      )}
    </div>
  )
}

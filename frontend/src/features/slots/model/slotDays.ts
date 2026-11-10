import { dayKey, formatDayNumber, formatMonthShort, formatWeekday } from '@/lib/datetime'
import type { Slot } from './types'

export interface SlotDay {
  /** Chave "2026-11-12" no fuso do app. */
  key: string
  weekday: string
  dayNumber: string
  monthShort: string
  slots: Slot[]
  availableCount: number
}

/** Agrupa horários por dia no fuso de São Paulo, em ordem cronológica. */
export function groupSlotsByDay(slots: Slot[]): SlotDay[] {
  const ordered = [...slots].sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())
  const groups = new Map<string, Slot[]>()

  for (const slot of ordered) {
    const key = dayKey(slot.startsAt)
    const bucket = groups.get(key)
    if (bucket) bucket.push(slot)
    else groups.set(key, [slot])
  }

  return [...groups.entries()].map(([key, daySlots]) => {
    const first = daySlots[0]!.startsAt
    return {
      key,
      weekday: formatWeekday(first),
      dayNumber: formatDayNumber(first),
      monthShort: formatMonthShort(first),
      slots: daySlots,
      availableCount: daySlots.filter((slot) => slot.available).length,
    }
  })
}

/** Dia pré-selecionado: o primeiro com vaga; senão o primeiro da lista. */
export function defaultDayKey(days: SlotDay[]): string | null {
  return days.find((day) => day.availableCount > 0)?.key ?? days[0]?.key ?? null
}

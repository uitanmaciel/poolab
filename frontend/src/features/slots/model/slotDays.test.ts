import { describe, expect, it } from 'vitest'
import { dayKey } from '@/lib/datetime'
import { defaultDayKey, groupSlotsByDay } from './slotDays'
import type { Slot } from './types'

function slot(id: string, startsAt: string, available = true): Slot {
  const start = new Date(startsAt)
  return { id, startsAt: start, endsAt: new Date(start.getTime() + 30 * 60_000), available }
}

describe('agrupamento por dia no fuso de São Paulo', () => {
  it('agrupa pelo dia local de Salvador, não pelo dia UTC', () => {
    // 23:30 de 12/nov em -03:00 já é 02:30 UTC de 13/nov: deve cair no dia 12.
    const late = slot('a', '2026-11-12T23:30:00-03:00')
    const early = slot('b', '2026-11-13T00:30:00-03:00')
    expect(dayKey(late.startsAt)).toBe('2026-11-12')
    expect(dayKey(early.startsAt)).toBe('2026-11-13')

    const days = groupSlotsByDay([early, late])
    expect(days.map((day) => day.key)).toEqual(['2026-11-12', '2026-11-13'])
  })

  it('conta vagas por dia e escolhe o primeiro dia com vaga', () => {
    const days = groupSlotsByDay([
      slot('1', '2026-11-12T09:00:00-03:00', false),
      slot('2', '2026-11-12T10:00:00-03:00', false),
      slot('3', '2026-11-13T09:00:00-03:00', true),
    ])
    expect(days[0]?.availableCount).toBe(0)
    expect(days[1]?.availableCount).toBe(1)
    expect(defaultDayKey(days)).toBe('2026-11-13')
  })
})

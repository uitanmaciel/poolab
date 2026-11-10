import { useCallback, useEffect, useMemo, useState } from 'react'
import type { AttendanceType } from '@/domain/attendance'
import { ApiError } from '@/lib/http/apiClient'
import { slotsApi } from '../api/slotsApi'
import { defaultDayKey, groupSlotsByDay, type SlotDay } from '../model/slotDays'
import type { Slot } from '../model/types'

export interface SlotsQuery {
  type: AttendanceType
  professionalId?: string
}

export type SlotsStatus = 'loading' | 'ready' | 'error'

/**
 * Carrega a janela de horários de um tipo/responsável e expõe os dias e o dia selecionado.
 * `reload` rebusca a janela (usado após 409 SLOT_UNAVAILABLE).
 */
export function useSlotsViewModel(query: SlotsQuery | null) {
  const type = query?.type ?? null
  const professionalId = query?.professionalId
  const [slots, setSlots] = useState<Slot[]>([])
  const [status, setStatus] = useState<SlotsStatus>('loading')
  const [error, setError] = useState<string | null>(null)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (!type) return
    let active = true
    setStatus('loading')
    setError(null)
    slotsApi
      .list(type, professionalId)
      .then((list) => {
        if (!active) return
        setSlots(list)
        setStatus('ready')
      })
      .catch((err: unknown) => {
        if (!active) return
        setError(err instanceof ApiError ? err.message : 'Não foi possível carregar os horários.')
        setStatus('error')
      })
    return () => {
      active = false
    }
  }, [type, professionalId, reloadKey])

  const days = useMemo<SlotDay[]>(() => groupSlotsByDay(slots), [slots])

  // Mantém o dia escolhido se ainda existir; senão escolhe o primeiro com vaga.
  const activeDay = useMemo(() => {
    if (selectedDay && days.some((day) => day.key === selectedDay)) return selectedDay
    return defaultDayKey(days)
  }, [days, selectedDay])

  const reload = useCallback(() => setReloadKey((key) => key + 1), [])

  // Sem consulta (ex.: agendamento ainda carregando) não há horários nem erro.
  if (!type) return { status: 'loading' as const, error: null, days: [], selectedDayKey: null, selectedDay: null, selectDay: setSelectedDay, reload }

  return {
    status,
    error,
    days,
    selectedDayKey: activeDay,
    selectedDay: days.find((day) => day.key === activeDay) ?? null,
    selectDay: setSelectedDay,
    reload,
  }
}

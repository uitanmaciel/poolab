import { useCallback, useEffect, useMemo, useState } from 'react'
import { ApiError } from '@/lib/http/apiClient'
import { appointmentsApi } from '../api/appointmentsApi'
import { groupAppointments } from '../model/status'
import type { Appointment } from '../model/types'

export function useMyAppointmentsViewModel() {
  const [items, setItems] = useState<Appointment[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  // Instante da última carga: evita ler o relógio durante o render.
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    let active = true
    setStatus('loading')
    setError(null)
    appointmentsApi
      .listMine()
      .then((list) => {
        if (!active) return
        setItems(list)
        setNow(new Date())
        setStatus('ready')
      })
      .catch((err: unknown) => {
        if (!active) return
        setError(err instanceof ApiError ? err.message : 'Não foi possível carregar seus agendamentos.')
        setStatus('error')
      })
    return () => {
      active = false
    }
  }, [reloadKey])

  const reload = useCallback(() => setReloadKey((key) => key + 1), [])

  // Recalcula a separação quando a lista muda. `now` vem de uma leitura por carregamento.
  const groups = useMemo(() => groupAppointments(items, now), [items, now])

  /** Cancela e devolve o agendamento; o chamador decide a navegação pelos códigos de erro. */
  const cancel = useCallback(async (code: string) => {
    return appointmentsApi.cancel(code)
  }, [])

  return { status, error, groups, now, isEmpty: items.length === 0, reload, cancel }
}

import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '@/lib/http/apiClient'
import { appointmentsApi } from '../api/appointmentsApi'
import type { Appointment } from '../model/types'

/** Carrega um agendamento pelo código (resultado, erro e reagendamento). */
export function useAppointmentViewModel(code: string | undefined) {
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'not-found' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    if (!code) {
      setStatus('not-found')
      return
    }
    let active = true
    setStatus('loading')
    setError(null)
    appointmentsApi
      .get(code)
      .then((item) => {
        if (!active) return
        setAppointment(item)
        setNow(new Date())
        setStatus('ready')
      })
      .catch((err: unknown) => {
        if (!active) return
        if (err instanceof ApiError && err.status === 404) {
          setStatus('not-found')
          return
        }
        setError(err instanceof ApiError ? err.message : 'Não foi possível carregar o agendamento.')
        setStatus('error')
      })
    return () => {
      active = false
    }
  }, [code, reloadKey])

  const reload = useCallback(() => setReloadKey((key) => key + 1), [])

  return { appointment, status, error, reload, now }
}

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { AttendanceType } from '@/domain/attendance'
import { ApiError } from '@/lib/http/apiClient'
import { catalogApi } from '../api/catalogApi'
import type { Professional } from '../model/types'

export type LoadStatus = 'loading' | 'ready' | 'error'

export function filterProfessionals(list: Professional[], query: string): Professional[] {
  const term = query.trim().toLocaleLowerCase('pt-BR')
  if (!term) return list
  return list.filter(
    (item) =>
      item.name.toLocaleLowerCase('pt-BR').includes(term) ||
      (item.courseName ?? '').toLocaleLowerCase('pt-BR').includes(term),
  )
}

export function useProfessionalsViewModel(type: Exclude<AttendanceType, 'CRA'>) {
  const [items, setItems] = useState<Professional[]>([])
  const [status, setStatus] = useState<LoadStatus>('loading')
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true
    setStatus('loading')
    setError(null)
    catalogApi
      .professionals(type)
      .then((list) => {
        if (!active) return
        setItems(list)
        setStatus('ready')
      })
      .catch((err: unknown) => {
        if (!active) return
        setError(err instanceof ApiError ? err.message : 'Não foi possível carregar os responsáveis.')
        setStatus('error')
      })
    return () => {
      active = false
    }
  }, [type, reloadKey])

  const reload = useCallback(() => setReloadKey((key) => key + 1), [])
  const visible = useMemo(() => filterProfessionals(items, query), [items, query])

  return { status, error, items: visible, total: items.length, query, setQuery, reload }
}

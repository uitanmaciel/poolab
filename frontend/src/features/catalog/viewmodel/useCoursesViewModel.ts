import { useEffect, useState } from 'react'
import { ApiError } from '@/lib/http/apiClient'
import { catalogApi } from '../api/catalogApi'
import type { Course } from '../model/types'

export function useCoursesViewModel() {
  const [courses, setCourses] = useState<Course[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    catalogApi
      .courses()
      .then((list) => {
        if (!active) return
        setCourses(list.map((course) => ({ code: course.code, name: course.name })))
        setStatus('ready')
      })
      .catch((err: unknown) => {
        if (!active) return
        setError(err instanceof ApiError ? err.message : 'Não foi possível carregar os cursos.')
        setStatus('error')
      })
    return () => {
      active = false
    }
  }, [])

  return { courses, status, error }
}

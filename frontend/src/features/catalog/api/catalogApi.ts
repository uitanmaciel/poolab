import { apiRequest } from '@/lib/http/apiClient'
import type { AttendanceType } from '@/domain/attendance'
import { toProfessional, type CourseDto, type Professional, type ProfessionalDto } from '../model/types'

export const catalogApi = {
  courses: async (): Promise<CourseDto[]> => apiRequest<CourseDto[]>('/courses'),

  /** Só para COORDINATION e PROFESSOR. CRA não tem responsável (docs/api.md). */
  professionals: async (type: Exclude<AttendanceType, 'CRA'>): Promise<Professional[]> => {
    const query = type === 'PROFESSOR' ? 'PROFESSOR' : 'COORDINATION'
    const list = await apiRequest<ProfessionalDto[]>(`/professionals?type=${query}`)
    return list.map(toProfessional)
  },
}

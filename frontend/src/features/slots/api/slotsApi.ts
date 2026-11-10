import { apiRequest } from '@/lib/http/apiClient'
import type { AttendanceType } from '@/domain/attendance'
import { toSlot, type Slot, type SlotDto } from '../model/types'

export const slotsApi = {
  /**
   * `professionalId` é obrigatório para PROFESSOR e COORDINATION e não deve ser enviado para CRA.
   */
  list: async (type: AttendanceType, professionalId?: string): Promise<Slot[]> => {
    const params = new URLSearchParams({ type })
    if (type !== 'CRA' && professionalId) params.set('professionalId', professionalId)
    const list = await apiRequest<SlotDto[]>(`/slots?${params.toString()}`)
    return list.map(toSlot)
  },
}

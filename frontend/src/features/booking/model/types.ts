import type { AttendanceType } from '@/domain/attendance'
import type { Professional } from '@/features/catalog/model/types'
import type { Slot } from '@/features/slots/model/types'

/** Rascunho do agendamento em andamento. Vive só na memória da sessão do fluxo. */
export interface BookingDraft {
  type: AttendanceType | null
  professional: Professional | null
  slot: Slot | null
  reason: string
}

export const EMPTY_DRAFT: BookingDraft = {
  type: null,
  professional: null,
  slot: null,
  reason: '',
}

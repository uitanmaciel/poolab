import type { AttendanceType } from '@/domain/attendance'
import type { Professional } from '@/features/catalog/model/types'
import type { Slot } from '@/features/slots/model/types'
import { EMPTY_DRAFT, type BookingDraft } from './types'

export type BookingAction =
  | { type: 'chooseType'; attendanceType: AttendanceType }
  | { type: 'chooseProfessional'; professional: Professional }
  | { type: 'chooseSlot'; slot: Slot }
  | { type: 'setReason'; reason: string }
  /** 409 SLOT_UNAVAILABLE: some o horário, mantém tipo, responsável e motivo (RF-12). */
  | { type: 'slotUnavailable' }
  | { type: 'reset' }

export function bookingReducer(state: BookingDraft, action: BookingAction): BookingDraft {
  switch (action.type) {
    case 'chooseType':
      if (action.attendanceType === state.type) return state
      // Trocar o tipo invalida responsável e horário.
      return { ...state, type: action.attendanceType, professional: null, slot: null }
    case 'chooseProfessional':
      if (action.professional.id === state.professional?.id) return state
      return { ...state, professional: action.professional, slot: null }
    case 'chooseSlot':
      return { ...state, slot: action.slot }
    case 'setReason':
      return { ...state, reason: action.reason }
    case 'slotUnavailable':
      return { ...state, slot: null }
    case 'reset':
      return EMPTY_DRAFT
  }
}

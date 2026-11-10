import { useCallback, useContext } from 'react'
import type { AttendanceType } from '@/domain/attendance'
import type { Professional } from '@/features/catalog/model/types'
import { appointmentsApi } from '@/features/appointments/api/appointmentsApi'
import { ApiError } from '@/lib/http/apiClient'
import type { Slot } from '@/features/slots/model/types'
import { BookingContext } from './BookingContext'
import { toReasonPayload } from '../model/reason'
import { canContinue } from '../model/flow'
import type { BookingDraft } from '../model/types'

export type SubmitOutcome =
  | { kind: 'confirmed'; code: string }
  | { kind: 'slot-unavailable' }
  | { kind: 'error'; message: string }

export function useBookingViewModel() {
  const context = useContext(BookingContext)
  if (!context) throw new Error('useBookingViewModel precisa estar dentro de BookingProvider')
  const { draft, dispatch } = context

  const chooseType = useCallback(
    (attendanceType: AttendanceType) => dispatch({ type: 'chooseType', attendanceType }),
    [dispatch],
  )
  const chooseProfessional = useCallback(
    (professional: Professional) => dispatch({ type: 'chooseProfessional', professional }),
    [dispatch],
  )
  const chooseSlot = useCallback((slot: Slot) => dispatch({ type: 'chooseSlot', slot }), [dispatch])
  const setReason = useCallback((reason: string) => dispatch({ type: 'setReason', reason }), [dispatch])

  const submit = useCallback(async (current: BookingDraft): Promise<SubmitOutcome> => {
    if (!current.slot || !canContinue('review', current)) {
      return { kind: 'error', message: 'Confira o horário e o motivo antes de confirmar.' }
    }
    try {
      const appointment = await appointmentsApi.create({
        slotId: current.slot.id,
        reason: toReasonPayload(current.reason),
      })
      return { kind: 'confirmed', code: appointment.code }
    } catch (error) {
      if (error instanceof ApiError && error.code === 'SLOT_UNAVAILABLE') {
        dispatch({ type: 'slotUnavailable' })
        return { kind: 'slot-unavailable' }
      }
      return {
        kind: 'error',
        message: error instanceof ApiError ? error.message : 'Não foi possível confirmar agora. Tente novamente.',
      }
    }
  }, [dispatch])

  return {
    draft,
    chooseType,
    chooseProfessional,
    chooseSlot,
    setReason,
    submit: () => submit(draft),
    reset: useCallback(() => dispatch({ type: 'reset' }), [dispatch]),
  }
}

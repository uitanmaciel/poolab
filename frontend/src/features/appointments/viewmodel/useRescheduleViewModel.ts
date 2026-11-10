import { useCallback, useState } from 'react'
import { ApiError } from '@/lib/http/apiClient'
import type { Slot } from '@/features/slots/model/types'
import { useSlotsViewModel } from '@/features/slots/viewmodel/useSlotsViewModel'
import { appointmentsApi } from '../api/appointmentsApi'
import type { Appointment } from '../model/types'
import { useAppointmentViewModel } from './useAppointmentViewModel'

export type RescheduleOutcome =
  | { kind: 'rescheduled'; appointment: Appointment; previousStartsAt: Date }
  | { kind: 'slot-unavailable' }
  | { kind: 'not-editable'; code: 'APPOINTMENT_ALREADY_CANCELLED' | 'APPOINTMENT_NOT_EDITABLE' }
  | { kind: 'error'; message: string }

/**
 * Reagendamento: mesmo tipo e responsável do agendamento original (docs/api.md).
 * CRA não envia professionalId.
 */
export function useRescheduleViewModel(code: string | undefined) {
  const { appointment, status: appointmentStatus, error: appointmentError } = useAppointmentViewModel(code)
  const slots = useSlotsViewModel(
    appointment ? { type: appointment.type, professionalId: appointment.professional?.id } : null,
  )
  const [selected, setSelected] = useState<Slot | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const choose = useCallback((slot: Slot) => setSelected(slot), [])

  const submit = useCallback(async (): Promise<RescheduleOutcome | null> => {
    if (!appointment || !selected) return null
    setSubmitting(true)
    try {
      const updated = await appointmentsApi.reschedule(appointment.code, selected.id)
      return { kind: 'rescheduled', appointment: updated, previousStartsAt: appointment.startsAt }
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.code === 'SLOT_UNAVAILABLE') {
          setSelected(null)
          slots.reload()
          return { kind: 'slot-unavailable' }
        }
        if (error.code === 'APPOINTMENT_ALREADY_CANCELLED' || error.code === 'APPOINTMENT_NOT_EDITABLE') {
          return { kind: 'not-editable', code: error.code }
        }
        return { kind: 'error', message: error.message }
      }
      return { kind: 'error', message: 'Não foi possível reagendar agora. Tente novamente.' }
    } finally {
      setSubmitting(false)
    }
  }, [appointment, selected, slots])

  return {
    appointment,
    appointmentStatus,
    appointmentError,
    slots,
    selected,
    choose,
    submitting,
    submit,
  }
}

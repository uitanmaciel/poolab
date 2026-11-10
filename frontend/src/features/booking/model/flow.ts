import { attendanceOption, type AttendanceType } from '@/domain/attendance'
import { isReasonValid } from './reason'
import type { BookingDraft } from './types'

export type BookingStep = 'type' | 'professional' | 'slot' | 'review'

export const BOOKING_PATHS: Record<BookingStep, string> = {
  type: '/agendar',
  professional: '/agendar/responsavel',
  slot: '/agendar/horario',
  review: '/agendar/revisao',
}

export const BOOKING_STEP_LABELS: Record<BookingStep, string> = {
  type: 'Atendimento',
  professional: 'Responsável',
  slot: 'Horário',
  review: 'Motivo e revisão',
}

/** CRA tem 3 passos; Coordenação e Professor têm 4. */
export function stepsFor(type: AttendanceType | null): BookingStep[] {
  if (type && !attendanceOption(type).needsProfessional) return ['type', 'slot', 'review']
  return ['type', 'professional', 'slot', 'review']
}

/** Um passo só é acessível quando os anteriores estão completos. */
export function isStepReachable(step: BookingStep, draft: BookingDraft): boolean {
  switch (step) {
    case 'type':
      return true
    case 'professional':
      return draft.type !== null && attendanceOption(draft.type).needsProfessional
    case 'slot':
      return draft.type !== null && (!attendanceOption(draft.type).needsProfessional || draft.professional !== null)
    case 'review':
      return draft.slot !== null && isReasonValid(draft.reason)
  }
}

export function canContinue(step: BookingStep, draft: BookingDraft): boolean {
  switch (step) {
    case 'type':
      return draft.type !== null
    case 'professional':
      return draft.professional !== null
    case 'slot':
      return draft.slot !== null && draft.slot.available
    case 'review':
      return draft.slot !== null && isReasonValid(draft.reason)
  }
}

/** Próximo passo após o atual, respeitando o caminho do tipo escolhido. */
export function nextStep(current: BookingStep, type: AttendanceType | null): BookingStep | null {
  const steps = stepsFor(type)
  const index = steps.indexOf(current)
  return index >= 0 ? (steps[index + 1] ?? null) : null
}

export function previousStep(current: BookingStep, type: AttendanceType | null): BookingStep | null {
  const steps = stepsFor(type)
  const index = steps.indexOf(current)
  return index > 0 ? (steps[index - 1] ?? null) : null
}

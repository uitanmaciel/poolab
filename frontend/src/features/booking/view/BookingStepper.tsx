import { StepIndicator } from '@/components/StepIndicator'
import type { AttendanceType } from '@/domain/attendance'
import { BOOKING_STEP_LABELS, stepsFor, type BookingStep } from '../model/flow'

/** Indicador de etapas adaptado ao tipo escolhido (CRA tem 3 passos). */
export function BookingStepper({ step, type }: { step: BookingStep; type: AttendanceType | null }) {
  const steps = stepsFor(type)
  return (
    <StepIndicator
      steps={steps.map((id) => ({ id, label: BOOKING_STEP_LABELS[id] }))}
      currentIndex={Math.max(0, steps.indexOf(step))}
    />
  )
}

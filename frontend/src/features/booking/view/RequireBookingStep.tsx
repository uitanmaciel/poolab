import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { isStepReachable, type BookingStep } from '../model/flow'
import { useBookingViewModel } from '../viewmodel/useBookingViewModel'

/** Sem os passos anteriores completos, volta ao início do fluxo. */
export function RequireBookingStep({ step, children }: { step: BookingStep; children: ReactNode }) {
  const { draft } = useBookingViewModel()
  if (!isStepReachable(step, draft)) return <Navigate to="/agendar" replace />
  return <>{children}</>
}

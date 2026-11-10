import { AlertTriangle } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ErrorAlert } from '@/components/ErrorAlert'
import { PageHeading } from '@/components/PageHeading'
import { StepActions } from '@/components/StepActions'
import { attendanceLabel } from '@/domain/attendance'
import { formatLongDate, formatTime } from '@/lib/datetime'
import { SlotPicker } from '@/features/slots/view/SlotPicker'
import { useSlotsViewModel } from '@/features/slots/viewmodel/useSlotsViewModel'
import { BookingStepper } from '@/features/booking/view/BookingStepper'
import { RequireBookingStep } from '@/features/booking/view/RequireBookingStep'
import { BOOKING_PATHS, previousStep } from '@/features/booking/model/flow'
import { useBookingViewModel } from '@/features/booking/viewmodel/useBookingViewModel'

/** Estado enviado pela revisão quando o horário foi ocupado no momento da confirmação. */
export interface SlotConflictState {
  conflict?: { startsAt: string; professionalName: string | null }
}

export function BookingSlotPage() {
  return (
    <RequireBookingStep step="slot">
      <SlotStep />
    </RequireBookingStep>
  )
}

function SlotStep() {
  const { draft, chooseSlot } = useBookingViewModel()
  const navigate = useNavigate()
  const location = useLocation()
  const conflict = (location.state as SlotConflictState | null)?.conflict ?? null

  const type = draft.type!
  const professionalId = draft.professional?.id
  const slots = useSlotsViewModel({ type, professionalId })
  const back = previousStep('slot', type)

  return (
    <AppLayout
      footer={
        <StepActions
          onBack={() => back && navigate(BOOKING_PATHS[back])}
          onContinue={() => navigate(BOOKING_PATHS.review)}
          continueDisabled={draft.slot === null || !draft.slot.available}
        />
      }
    >
      <div className="flex flex-col gap-6">
        <BookingStepper step="slot" type={type} />
        <PageHeading
          title="Escolha um horário"
          description="Atendimentos de 30 min, nos próximos 14 dias."
          action={
            <span className="inline-flex items-center gap-2 rounded-xl border-[1.5px] border-border bg-card px-4 py-2.5 text-sm">
              <span className="font-semibold">{attendanceLabel(type)}</span>
              {draft.professional ? <span>{draft.professional.name}</span> : null}
              {draft.type !== 'CRA' ? (
                <button type="button" onClick={() => navigate(BOOKING_PATHS.professional)} className="font-semibold text-primary underline-offset-4 hover:underline">
                  Alterar
                </button>
              ) : null}
            </span>
          }
        />

        {conflict ? (
          <ErrorAlert title="Esse horário acabou de ser ocupado">
            {formatLongDate(new Date(conflict.startsAt))}, às {formatTime(new Date(conflict.startsAt))}
            {conflict.professionalName ? ` com ${conflict.professionalName}` : ''} não está mais disponível e nada foi
            confirmado. Escolha outro horário abaixo; o motivo que você escreveu foi mantido.
          </ErrorAlert>
        ) : null}

        <SlotPicker
          status={slots.status}
          error={slots.error}
          days={slots.days}
          selectedDayKey={slots.selectedDayKey}
          selectedDay={slots.selectedDay}
          onSelectDay={slots.selectDay}
          selectedSlot={draft.slot}
          onSelectSlot={chooseSlot}
          onRetry={slots.reload}
        />

        {draft.slot === null ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertTriangle aria-hidden="true" className="size-4" />
            O botão Continuar fica desabilitado até você escolher um horário.
          </p>
        ) : null}
      </div>
    </AppLayout>
  )
}

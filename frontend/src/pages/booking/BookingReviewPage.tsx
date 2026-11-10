import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ErrorAlert } from '@/components/ErrorAlert'
import { PageHeading } from '@/components/PageHeading'
import { StepActions } from '@/components/StepActions'
import { ReasonField } from '@/features/booking/view/ReasonField'
import { ReviewSummary } from '@/features/booking/view/ReviewSummary'
import { BookingStepper } from '@/features/booking/view/BookingStepper'
import { RequireBookingStep } from '@/features/booking/view/RequireBookingStep'
import { BOOKING_PATHS, canContinue, previousStep } from '@/features/booking/model/flow'
import { useBookingViewModel } from '@/features/booking/viewmodel/useBookingViewModel'
import type { SlotConflictState } from './BookingSlotPage'

export function BookingReviewPage() {
  return (
    <RequireBookingStep step="review">
      <ReviewStep />
    </RequireBookingStep>
  )
}

function ReviewStep() {
  const { draft, setReason, submit } = useBookingViewModel()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const type = draft.type!
  const slot = draft.slot!
  const back = previousStep('review', type)
  const canConfirm = canContinue('review', draft) && !submitting

  async function confirm() {
    setFormError(null)
    setSubmitting(true)
    const snapshot = { professionalName: draft.professional?.name ?? null, startsAt: slot.startsAt.toISOString() }
    const outcome = await submit()
    setSubmitting(false)

    if (outcome.kind === 'confirmed') {
      // O rascunho é limpo na tela de confirmação: limpar aqui faz RequireBookingStep redirecionar para /agendar.
      navigate(`/confirmacao/${encodeURIComponent(outcome.code)}`, { replace: true })
    } else if (outcome.kind === 'slot-unavailable') {
      // O motivo continua no rascunho; a tela de horário explica o conflito.
      const state: SlotConflictState = { conflict: snapshot }
      navigate(BOOKING_PATHS.slot, { replace: true, state })
    } else {
      setFormError(outcome.message)
    }
  }

  return (
    <AppLayout
      footer={
        <StepActions
          onBack={() => back && navigate(BOOKING_PATHS[back])}
          onContinue={confirm}
          continueLabel="Confirmar agendamento"
          continueDisabled={!canConfirm}
          loading={submitting}
        />
      }
    >
      <div className="flex flex-col gap-6">
        <BookingStepper step="review" type={type} />
        <PageHeading
          title="Revise e confirme"
          description="Confira os dados. Nada é reservado até você confirmar."
        />
        {formError ? <ErrorAlert title="Não foi possível confirmar">{formError}</ErrorAlert> : null}
        <div className="grid gap-8 md:grid-cols-2 md:items-start">
          <ReasonField value={draft.reason} onChange={setReason} />
          <div className="flex flex-col gap-4">
            <ReviewSummary type={type} professional={draft.professional} slot={slot} reason={draft.reason} />
            <p className="text-sm text-muted-foreground">
              Atendimento de 30 minutos. Depois de confirmar, você pode cancelar ou reagendar em &ldquo;Meus agendamentos&rdquo;.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

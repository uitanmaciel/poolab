import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ErrorAlert } from '@/components/ErrorAlert'
import { LoadErrorState, LoadingState } from '@/components/StateMessage'
import { PageHeading } from '@/components/PageHeading'
import { StepActions } from '@/components/StepActions'
import { SlotPicker } from '@/features/slots/view/SlotPicker'
import { useRescheduleViewModel } from '@/features/appointments/viewmodel/useRescheduleViewModel'
import { attendanceLabel } from '@/domain/attendance'
import { formatLongDate, formatTime } from '@/lib/datetime'

export function ReschedulePage() {
  const { code = '' } = useParams()
  const navigate = useNavigate()
  const vm = useRescheduleViewModel(code)
  const [notice, setNotice] = useState<string | null>(null)

  if (vm.appointmentStatus === 'loading') {
    return (
      <AppLayout>
        <LoadingState label="Carregando agendamento" lines={3} />
      </AppLayout>
    )
  }
  if (vm.appointmentStatus === 'not-found') return <Navigate to="/agendamentos" replace />
  if (vm.appointmentStatus === 'error' || !vm.appointment) {
    return (
      <AppLayout>
        <LoadErrorState message={vm.appointmentError ?? 'Tente novamente.'} onRetry={() => window.location.reload()} />
      </AppLayout>
    )
  }

  const appointment = vm.appointment
  // Sem edição permitida, a própria tela de erro explica o motivo (frames Web 16 e 17).
  if (!appointment.editable) {
    const motivo = appointment.status === 'CANCELLED' ? 'cancelado' : 'nao-editavel'
    return <Navigate to={`/agendamentos/${encodeURIComponent(code)}/erro/${motivo}`} replace />
  }

  async function confirm() {
    setNotice(null)
    const outcome = await vm.submit()
    if (!outcome) return
    if (outcome.kind === 'rescheduled') {
      navigate(`/agendamentos/${encodeURIComponent(code)}/reagendado`, {
        replace: true,
        state: { previousStartsAt: outcome.previousStartsAt.toISOString() },
      })
    } else if (outcome.kind === 'slot-unavailable') {
      setNotice('Esse horário acabou de ser ocupado. Escolha outro horário abaixo; seu agendamento continua no horário anterior.')
    } else if (outcome.kind === 'not-editable') {
      navigate(
        `/agendamentos/${encodeURIComponent(code)}/erro/${outcome.code === 'APPOINTMENT_ALREADY_CANCELLED' ? 'cancelado' : 'nao-editavel'}`,
        { replace: true },
      )
    } else {
      setNotice(outcome.message)
    }
  }

  const current = `${formatLongDate(appointment.startsAt)}, ${formatTime(appointment.startsAt)} a ${formatTime(appointment.endsAt)}`

  return (
    <AppLayout
      footer={
        <StepActions
          onBack={() => navigate('/agendamentos')}
          backLabel="Voltar"
          onContinue={confirm}
          continueLabel="Confirmar novo horário"
          continueDisabled={!vm.selected || vm.submitting}
          loading={vm.submitting}
        />
      }
    >
      <div className="flex flex-col gap-6">
        <PageHeading
          title="Reagendar atendimento"
          description="Escolha um novo horário. O código do agendamento não muda."
          action={
            <span className="inline-flex flex-wrap items-center gap-2 rounded-xl border-[1.5px] border-border bg-card px-4 py-2.5 text-sm">
              <span className="font-mono font-semibold">{appointment.code}</span>
              <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-semibold text-primary">{attendanceLabel(appointment.type)}</span>
              {appointment.professional ? <span className="font-semibold">{appointment.professional.name}</span> : null}
            </span>
          }
        />

        <p className="inline-flex w-fit items-start gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm">
          Tipo e responsável não mudam. Para trocar, cancele este agendamento e crie outro.
        </p>

        {notice ? <ErrorAlert title="Não foi possível reagendar">{notice}</ErrorAlert> : null}

        <SlotPicker
          status={vm.slots.status}
          error={vm.slots.error}
          days={vm.slots.days}
          selectedDayKey={vm.slots.selectedDayKey}
          selectedDay={vm.slots.selectedDay}
          onSelectDay={vm.slots.selectDay}
          selectedSlot={vm.selected}
          onSelectSlot={vm.choose}
          onRetry={vm.slots.reload}
        />

        <p className="text-sm text-muted-foreground">Horário atual: {current}. Ele será liberado após a troca.</p>
      </div>
    </AppLayout>
  )
}

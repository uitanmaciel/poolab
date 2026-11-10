import type { ReactNode } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { AppLayout } from '@/components/layout/AppLayout'
import { LoadErrorState, LoadingState } from '@/components/StateMessage'
import { attendanceLabel } from '@/domain/attendance'
import { AppointmentResult } from '@/features/appointments/view/AppointmentResult'
import { describeAppointment } from '@/features/appointments/model/status'
import { useAppointmentViewModel } from '@/features/appointments/viewmodel/useAppointmentViewModel'
import type { Appointment } from '@/features/appointments/model/types'
import { formatAppointmentWhen, formatLongDate, formatTime } from '@/lib/datetime'
import type { SummaryRow } from '@/components/AppointmentSummary'
import { StatusBadge } from '@/components/StatusBadge'

/** Carregamento comum dos resultados: estado de rede/404 tratado aqui. */
function useResultAppointment() {
  const { code } = useParams()
  const vm = useAppointmentViewModel(code)
  return { code: code ?? '', ...vm }
}

function ResultFrame({
  status,
  error,
  onRetry,
  children,
}: {
  status: 'loading' | 'ready' | 'not-found' | 'error'
  error: string | null
  onRetry: () => void
  children: ReactNode
}) {
  const navigate = useNavigate()
  return (
    <AppLayout width="narrow">
      {status === 'loading' ? <LoadingState label="Carregando agendamento" lines={3} /> : null}
      {status === 'error' ? <LoadErrorState message={error ?? 'Tente novamente.'} onRetry={onRetry} /> : null}
      {status === 'not-found' ? (
        <LoadErrorState message="Não encontramos este agendamento na sua conta." onRetry={() => navigate('/agendamentos')} />
      ) : null}
      {status === 'ready' ? children : null}
    </AppLayout>
  )
}

function backButtons(navigate: ReturnType<typeof useNavigate>, withNew: boolean) {
  return (
    <>
      <Button onClick={() => navigate('/agendamentos')}>Voltar para Meus agendamentos</Button>
      {withNew ? (
        <Button variant="outline" onClick={() => navigate('/agendar')}>
          Novo agendamento
        </Button>
      ) : null}
    </>
  )
}

function commonRows(appointment: Appointment): SummaryRow[] {
  return [
    { label: 'Atendimento', value: attendanceLabel(appointment.type) },
    ...(appointment.professional ? [{ label: 'Responsável', value: appointment.professional.name }] : []),
  ]
}

/** Frame Web 12 / Mobile 11: cancelamento concluído. */
export function CancelledPage() {
  const navigate = useNavigate()
  const { appointment, status, error, reload, code } = useResultAppointment()
  return (
    <ResultFrame status={status} error={error} onRetry={reload}>
      {appointment ? (
        <AppointmentResult
          tone="error"
          title="Agendamento cancelado"
          description="O horário foi liberado. Nenhum e-mail é enviado neste MVP."
          code={{ label: 'Código', value: code, struck: true }}
          rows={[
            ...commonRows(appointment),
            { label: 'Era em', value: formatAppointmentWhen(appointment.startsAt, appointment.endsAt) },
          ]}
          actions={backButtons(navigate, true)}
        />
      ) : null}
    </ResultFrame>
  )
}

/** Frame Web 15 / Mobile 14: reagendamento concluído. O horário anterior vem da navegação (a API não o retorna). */
export function RescheduledPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { appointment, status, error, reload, code } = useResultAppointment()
  const previous = (location.state as { previousStartsAt?: string } | null)?.previousStartsAt
  const previousDate = previous ? new Date(previous) : null

  return (
    <ResultFrame status={status} error={error} onRetry={reload}>
      {appointment ? (
        <AppointmentResult
          tone="success"
          title="Agendamento reagendado"
          description="O horário anterior foi liberado. O código continua o mesmo."
          code={{ label: 'Código do agendamento (mantido)', value: code }}
          rows={[
            ...commonRows(appointment),
            ...(previousDate
              ? [{ label: 'Antes', value: formatAppointmentWhen(previousDate, new Date(previousDate.getTime() + 30 * 60_000)), struck: true }]
              : []),
            { label: 'Agora', value: formatAppointmentWhen(appointment.startsAt, appointment.endsAt) },
          ]}
          actions={backButtons(navigate, false)}
        />
      ) : null}
    </ResultFrame>
  )
}

/** Frames Web 16/17 e Mobile 15/16: agendamento já cancelado ou que não pode mais ser alterado. */
export function AppointmentErrorPage() {
  const navigate = useNavigate()
  const { motivo } = useParams()
  const { appointment, status, error, reload, code, now } = useResultAppointment()
  const cancelled = motivo === 'cancelado'

  return (
    <ResultFrame status={status} error={error} onRetry={reload}>
      {appointment ? (
        <AppointmentResult
          tone={cancelled ? 'error' : 'warning'}
          title={cancelled ? 'Este agendamento já foi cancelado' : 'Este agendamento não pode mais ser alterado'}
          description={
            cancelled
              ? 'Não é possível reagendar nem cancelar de novo.'
              : 'O atendimento já aconteceu ou está em andamento, então não há como reagendar ou cancelar.'
          }
          notice={{
            title: 'Nada foi alterado.',
            text: cancelled
              ? 'Esta tela pode estar desatualizada. Abra "Meus agendamentos" para ver o estado atual ou crie um novo agendamento.'
              : 'Se precisar de um novo atendimento, crie um novo agendamento.',
          }}
          code={{ label: 'Código', value: code, struck: cancelled }}
          rows={[
            { label: 'Estado', value: <StatusBadge view={describeAppointment(appointment, now)} /> },
            ...commonRows(appointment),
            cancelled
              ? { label: 'Era em', value: formatAppointmentWhen(appointment.startsAt, appointment.endsAt) }
              : { label: 'Quando', value: `${formatLongDate(appointment.startsAt)}, ${formatTime(appointment.startsAt)} a ${formatTime(appointment.endsAt)}` },
          ]}
          actions={backButtons(navigate, true)}
        />
      ) : null}
    </ResultFrame>
  )
}

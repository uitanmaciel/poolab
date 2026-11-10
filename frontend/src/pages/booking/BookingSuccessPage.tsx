import { useEffect, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/button'
import { AppointmentSummary } from '@/components/AppointmentSummary'
import { LoadErrorState, LoadingState } from '@/components/StateMessage'
import { attendanceLabel } from '@/domain/attendance'
import { formatAppointmentWhen } from '@/lib/datetime'
import { useBookingViewModel } from '@/features/booking/viewmodel/useBookingViewModel'
import { useAppointmentViewModel } from '@/features/appointments/viewmodel/useAppointmentViewModel'

/** Tela de confirmação, tema claro como as demais (frame Web 06 / Mobile 05). */
export function BookingSuccessPage() {
  const { code } = useParams()
  const navigate = useNavigate()
  const { appointment, status, error, reload } = useAppointmentViewModel(code)
  const [copied, setCopied] = useState(false)
  const { reset } = useBookingViewModel()

  useEffect(() => reset(), [reset])

  async function copyCode() {
    if (!code) return
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <AppLayout width="narrow">
      {status === 'loading' ? <LoadingState label="Carregando confirmação" lines={3} /> : null}
      {status === 'error' ? <LoadErrorState message={error ?? 'Tente novamente.'} onRetry={reload} /> : null}
      {status === 'not-found' ? (
        <LoadErrorState message="Não encontramos este agendamento na sua conta." onRetry={() => navigate('/agendamentos')} />
      ) : null}

      {status === 'ready' && appointment ? (
        <div className="flex flex-col items-center gap-6 pt-4 text-center md:pt-10">
          <span className="flex size-16 items-center justify-center rounded-full border-2 border-success bg-success-soft text-success">
            <Check aria-hidden="true" className="size-8" strokeWidth={3} />
          </span>
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-[28px] font-bold leading-tight md:text-[34px]">Agendamento confirmado</h1>
            <p className="text-[15px] text-muted-foreground">Guarde o código. Você vai precisar dele no atendimento.</p>
          </div>

          <div className="w-full rounded-2xl border-2 border-primary bg-card px-6 py-4">
            <p className="text-[13px] text-muted-foreground">Código do agendamento</p>
            <p className="font-mono text-[28px] font-medium tracking-[0.06em] md:text-[38px]">{appointment.code}</p>
          </div>

          <AppointmentSummary
            className="text-left"
            rows={[
              { label: 'Atendimento', value: attendanceLabel(appointment.type) },
              ...(appointment.professional ? [{ label: 'Responsável', value: appointment.professional.name }] : []),
              { label: 'Quando', value: formatAppointmentWhen(appointment.startsAt, appointment.endsAt) },
              { label: 'Motivo', value: appointment.reason ?? 'Não informado' },
            ]}
          />

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
            <Button onClick={() => navigate('/agendar')}>Novo agendamento</Button>
            <Button variant="outline" onClick={() => navigate('/agendamentos')}>
              Meus agendamentos
            </Button>
            <Button variant="outline" onClick={copyCode}>
              <Copy aria-hidden="true" />
              {copied ? 'Código copiado' : 'Copiar código'}
            </Button>
          </div>
          <p className="text-[13px] text-muted-foreground">
            Nenhum e-mail ou notificação é enviado neste MVP. Para rever, reagendar ou cancelar, abra &ldquo;Meus agendamentos&rdquo;.
          </p>
        </div>
      ) : null}
    </AppLayout>
  )
}

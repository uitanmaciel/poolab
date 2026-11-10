import { CalendarDays, Plus } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/button'
import { ErrorAlert } from '@/components/ErrorAlert'
import { EmptyState, LoadErrorState, LoadingState } from '@/components/StateMessage'
import { PageHeading } from '@/components/PageHeading'
import { AppointmentCard } from '@/features/appointments/view/AppointmentCard'
import { CancelDialog } from '@/features/appointments/view/CancelDialog'
import { useMyAppointmentsViewModel } from '@/features/appointments/viewmodel/useMyAppointmentsViewModel'
import type { Appointment } from '@/features/appointments/model/types'
import { ApiError } from '@/lib/http/apiClient'

export function MyAppointmentsPage() {
  const list = useMyAppointmentsViewModel()
  const navigate = useNavigate()
  const [target, setTarget] = useState<Appointment | null>(null)
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  async function confirmCancel() {
    if (!target) return
    setBusy(true)
    setActionError(null)
    try {
      await list.cancel(target.code)
      navigate(`/agendamentos/${encodeURIComponent(target.code)}/cancelado`)
    } catch (error) {
      setTarget(null)
      if (error instanceof ApiError && error.code === 'APPOINTMENT_ALREADY_CANCELLED') {
        navigate(`/agendamentos/${encodeURIComponent(target.code)}/erro/cancelado`)
      } else if (error instanceof ApiError && error.code === 'APPOINTMENT_NOT_EDITABLE') {
        navigate(`/agendamentos/${encodeURIComponent(target.code)}/erro/nao-editavel`)
      } else if (error instanceof ApiError && error.status === 404) {
        setActionError('Este agendamento não está mais disponível. Atualizamos a lista.')
        list.reload()
      } else {
        setActionError(error instanceof ApiError ? error.message : 'Não foi possível cancelar agora. Tente novamente.')
      }
    } finally {
      setBusy(false)
    }
  }

  const newButton = (
    <Button onClick={() => navigate('/agendar')} className="hidden md:inline-flex">
      <Plus aria-hidden="true" />
      Novo agendamento
    </Button>
  )

  return (
    <AppLayout showTabs>
      <div className="flex flex-col gap-6">
        <PageHeading
          title="Meus agendamentos"
          description="Reagende ou cancele atendimentos futuros. O código permanece o mesmo ao reagendar."
          action={newButton}
        />

        {actionError ? <ErrorAlert title="Ação não concluída">{actionError}</ErrorAlert> : null}

        {list.status === 'loading' ? <LoadingState label="Carregando agendamentos" lines={3} /> : null}
        {list.status === 'error' ? (
          <LoadErrorState message={list.error ?? 'Tente novamente.'} onRetry={list.reload} />
        ) : null}

        {list.status === 'ready' && list.isEmpty ? (
          <EmptyState
            icon={<CalendarDays className="size-8" />}
            title="Você ainda não tem agendamentos"
            description="Quando você confirmar um atendimento com um professor, uma coordenação ou a CRA, ele aparece aqui com o código AGD."
            action={<Button onClick={() => navigate('/agendar')}>Agendar um atendimento</Button>}
          />
        ) : null}

        {list.status === 'ready' && !list.isEmpty ? (
          <Groups
            now={list.now}
            upcoming={list.groups.upcoming}
            past={list.groups.past}
            onReschedule={(item) => navigate(`/agendamentos/${encodeURIComponent(item.code)}/reagendar`)}
            onCancel={setTarget}
          />
        ) : null}
      </div>

      <CancelDialog
        appointment={target}
        busy={busy}
        onOpenChange={(open) => {
          if (!open && !busy) setTarget(null)
        }}
        onConfirm={confirmCancel}
      />
    </AppLayout>
  )
}

function Groups({
  now,
  upcoming,
  past,
  onReschedule,
  onCancel,
}: {
  now: Date
  upcoming: Appointment[]
  past: Appointment[]
  onReschedule: (item: Appointment) => void
  onCancel: (item: Appointment) => void
}) {
  return (
    <div className="flex flex-col gap-6">
      {upcoming.length > 0 ? (
        <section aria-labelledby="proximos" className="flex flex-col gap-3">
          <h2 id="proximos" className="font-display text-base font-bold text-muted-foreground">
            Próximos
          </h2>
          {upcoming.map((item) => (
            <AppointmentCard
              key={item.code}
              appointment={item}
              now={now}
              onReschedule={() => onReschedule(item)}
              onCancel={() => onCancel(item)}
            />
          ))}
        </section>
      ) : null}
      {past.length > 0 ? (
        <section aria-labelledby="anteriores" className="flex flex-col gap-3">
          <h2 id="anteriores" className="font-display text-base font-bold text-muted-foreground">
            Anteriores
          </h2>
          {past.map((item) => (
            <AppointmentCard
              key={item.code}
              appointment={item}
              now={now}
              onReschedule={() => onReschedule(item)}
              onCancel={() => onCancel(item)}
            />
          ))}
        </section>
      ) : null}
    </div>
  )
}

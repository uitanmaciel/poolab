import { RotateCw, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/StatusBadge'
import { attendanceLabel } from '@/domain/attendance'
import { formatAppointmentWhen } from '@/lib/datetime'
import { describeAppointment } from '../model/status'
import type { Appointment } from '../model/types'

interface AppointmentCardProps {
  appointment: Appointment
  now: Date
  onReschedule: () => void
  onCancel: () => void
}

/**
 * Item de "Meus agendamentos". Ações só quando `editable` (decidido pelo servidor).
 * Agendamentos fora da lista de próximos ficam em estilo apagado.
 */
export function AppointmentCard({ appointment, now, onReschedule, onCancel }: AppointmentCardProps) {
  const view = describeAppointment(appointment, now)
  const past = view.group === 'past'
  const professionalLine = appointment.professional
    ? appointment.professional.name
    : 'Fila única'
  const showActions = appointment.editable

  return (
    <article
      aria-label={`Agendamento ${appointment.code}`}
      className={
        past
          ? 'flex flex-col gap-2 rounded-2xl border-[1.5px] border-border bg-secondary p-4'
          : 'flex flex-col gap-3 rounded-2xl border-[1.5px] border-border bg-card p-4 shadow-sm md:flex-row md:items-center md:gap-5 md:px-5'
      }
    >
      <div className="flex flex-wrap items-center gap-2 md:w-[170px] md:flex-none md:flex-col md:items-start">
        <span className={`font-mono text-[15px] font-semibold ${appointment.status === 'CANCELLED' ? 'line-through' : ''}`}>
          {appointment.code}
        </span>
        <span className="inline-flex h-6 items-center rounded-full bg-primary-soft px-2.5 text-xs font-semibold text-primary">
          {attendanceLabel(appointment.type)}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="font-display text-[17px] font-bold">{professionalLine}</span>
        <span className="text-sm text-muted-foreground">{formatAppointmentWhen(appointment.startsAt, appointment.endsAt)}</span>
      </div>

      <div className="flex flex-wrap items-center gap-2 md:w-[130px] md:flex-none md:justify-start">
        <StatusBadge view={view} />
      </div>

      {showActions ? (
        <div className="grid grid-cols-2 gap-2 md:flex md:w-[250px] md:flex-none md:justify-end">
          <Button variant="outline" size="sm" onClick={onReschedule}>
            <RotateCw aria-hidden="true" />
            Reagendar
          </Button>
          <Button variant="outline" size="sm" className="border-error text-error hover:text-error" onClick={onCancel}>
            <X aria-hidden="true" />
            Cancelar
          </Button>
        </div>
      ) : past ? (
        <p className="text-[13px] text-muted-foreground md:w-[250px] md:text-right">
          {view.group === 'past' && appointment.status !== 'CANCELLED' ? 'Não pode mais ser alterado' : 'Horário liberado'}
        </p>
      ) : null}
    </article>
  )
}

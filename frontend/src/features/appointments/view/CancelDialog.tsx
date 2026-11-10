import { CircleAlert, X } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { AppointmentSummary } from '@/components/AppointmentSummary'
import { attendanceLabel } from '@/domain/attendance'
import { formatAppointmentWhen } from '@/lib/datetime'
import type { Appointment } from '../model/types'

interface CancelDialogProps {
  appointment: Appointment | null
  busy: boolean
  onConfirm: () => void
  onOpenChange: (open: boolean) => void
}

/** Confirmação de cancelamento (frames Web 11 / Mobile 10). Ação destrutiva com aviso explícito. */
export function CancelDialog({ appointment, busy, onConfirm, onOpenChange }: CancelDialogProps) {
  return (
    <AlertDialog open={appointment !== null} onOpenChange={onOpenChange}>
      <AlertDialogContent className="grid-cols-[minmax(0,1fr)] gap-4 rounded-2xl p-6 data-[size=default]:max-w-[calc(100%-2rem)] data-[size=default]:sm:max-w-[560px]">
        <AlertDialogHeader className="gap-1 text-left">
          <div className="flex items-start gap-3">
            <span aria-hidden="true" className="flex size-11 flex-none items-center justify-center rounded-full bg-error-soft text-error">
              <CircleAlert className="size-5" />
            </span>
            <div>
              <AlertDialogTitle className="font-display text-2xl font-bold">Cancelar este agendamento?</AlertDialogTitle>
              <AlertDialogDescription>Confira os dados antes de continuar.</AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        {appointment ? (
          <AppointmentSummary
            rows={[
              { label: 'Código', value: appointment.code, mono: true },
              { label: 'Atendimento', value: attendanceLabel(appointment.type) },
              ...(appointment.professional ? [{ label: 'Responsável', value: appointment.professional.name }] : []),
              { label: 'Quando', value: formatAppointmentWhen(appointment.startsAt, appointment.endsAt) },
            ]}
          />
        ) : null}

        <div role="note" className="flex gap-2.5 rounded-lg border-l-4 border-error bg-error-soft px-3.5 py-3 text-sm">
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4 flex-none text-error" />
          <span>
            <span className="font-semibold">Esta ação não pode ser desfeita.</span> O horário será liberado para outros
            estudantes. Para ser atendido, você precisará criar um novo agendamento.
          </span>
        </div>

        <AlertDialogFooter className="m-0 flex-col gap-2 rounded-none border-0 bg-transparent p-0 sm:flex-row sm:justify-end">
          <AlertDialogCancel disabled={busy} className="h-11">
            Manter agendamento
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={busy}
            onClick={(event) => {
              // Mantém o diálogo aberto até a resposta; a página decide a navegação.
              event.preventDefault()
              onConfirm()
            }}
            className="h-11 bg-error text-white hover:bg-error/90"
          >
            <X aria-hidden="true" />
            {busy ? 'Cancelando…' : 'Sim, cancelar agendamento'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

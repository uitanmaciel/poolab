import { AppointmentSummary, type SummaryRow } from '@/components/AppointmentSummary'
import { attendanceLabel, type AttendanceType } from '@/domain/attendance'
import { formatLongDate, formatTime } from '@/lib/datetime'
import type { Professional } from '@/features/catalog/model/types'
import type { Slot } from '@/features/slots/model/types'

interface ReviewSummaryProps {
  type: AttendanceType
  professional: Professional | null
  slot: Slot
  reason: string
  onChangeProfessional?: () => void
  onChangeSlot?: () => void
}

/** Resumo do agendamento antes da confirmação (RF-09). */
export function ReviewSummary({ type, professional, slot, reason }: ReviewSummaryProps) {
  const rows: SummaryRow[] = [
    { label: 'Atendimento', value: attendanceLabel(type) },
  ]
  if (professional) rows.push({ label: 'Responsável', value: professional.name })
  rows.push({ label: 'Data', value: formatLongDate(slot.startsAt) })
  rows.push({ label: 'Horário', value: `${formatTime(slot.startsAt)} às ${formatTime(slot.endsAt)}` })
  rows.push({ label: 'Motivo', value: reason.trim() || 'Não informado' })
  return <AppointmentSummary rows={rows} />
}

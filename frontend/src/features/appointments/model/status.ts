import type { Appointment } from './types'

export type StatusTone = 'success' | 'error' | 'primary' | 'neutral'
export type StatusIcon = 'check' | 'cross' | 'clock' | 'dot'

export interface AppointmentStatusView {
  label: string
  tone: StatusTone
  icon: StatusIcon
  group: 'upcoming' | 'past'
}

/**
 * Mapeia status + editable para o que a tela mostra. `now` é injetado para testes.
 * Confirmado e não editável com horário já passado é "Concluído" (ou "Em andamento" durante o atendimento).
 */
export function describeAppointment(appointment: Appointment, now: Date): AppointmentStatusView {
  if (appointment.status === 'CANCELLED') {
    return { label: 'Cancelado', tone: 'error', icon: 'cross', group: 'past' }
  }
  if (appointment.status === 'COMPLETED') {
    return { label: 'Concluído', tone: 'neutral', icon: 'dot', group: 'past' }
  }
  if (appointment.editable) {
    return { label: 'Confirmado', tone: 'success', icon: 'check', group: 'upcoming' }
  }
  if (appointment.endsAt.getTime() > now.getTime() && appointment.startsAt.getTime() <= now.getTime()) {
    return { label: 'Em andamento', tone: 'primary', icon: 'clock', group: 'past' }
  }
  return { label: 'Concluído', tone: 'neutral', icon: 'dot', group: 'past' }
}

export function groupAppointments(list: Appointment[], now: Date) {
  const sorted = [...list].sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())
  const upcoming: Appointment[] = []
  const past: Appointment[] = []
  for (const appointment of sorted) {
    if (describeAppointment(appointment, now).group === 'upcoming') upcoming.push(appointment)
    else past.push(appointment)
  }
  // Anteriores: mais recentes primeiro.
  past.reverse()
  return { upcoming, past }
}

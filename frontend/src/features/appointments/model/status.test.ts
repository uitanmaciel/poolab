import { describe, expect, it } from 'vitest'
import { describeAppointment, groupAppointments } from './status'
import type { Appointment } from './types'

const NOW = new Date('2026-11-12T09:00:00-03:00')

function appt(overrides: Partial<Appointment>): Appointment {
  return {
    code: 'AGD-2026-552',
    status: 'CONFIRMED',
    type: 'PROFESSOR',
    professional: null,
    startsAt: new Date('2026-11-12T10:00:00-03:00'),
    endsAt: new Date('2026-11-12T10:30:00-03:00'),
    reason: null,
    editable: true,
    ...overrides,
  }
}

describe('describeAppointment (status + editable)', () => {
  it('confirmado e editável é "Confirmado" e fica em próximos', () => {
    expect(describeAppointment(appt({}), NOW)).toMatchObject({ label: 'Confirmado', tone: 'success', group: 'upcoming' })
  })

  it('cancelado é "Cancelado" com erro, mesmo sem editável', () => {
    expect(describeAppointment(appt({ status: 'CANCELLED', editable: false }), NOW)).toMatchObject({
      label: 'Cancelado',
      tone: 'error',
      group: 'past',
    })
  })

  it('concluído pelo servidor é "Concluído"', () => {
    expect(describeAppointment(appt({ status: 'COMPLETED', editable: false }), NOW).label).toBe('Concluído')
  })

  it('confirmado, não editável, em andamento mostra "Em andamento" (não "Concluído")', () => {
    const inProgress = appt({
      startsAt: new Date('2026-11-12T08:45:00-03:00'),
      endsAt: new Date('2026-11-12T09:15:00-03:00'),
      editable: false,
    })
    expect(describeAppointment(inProgress, NOW).label).toBe('Em andamento')
  })

  it('confirmado, não editável, já encerrado mostra "Concluído"', () => {
    const over = appt({
      startsAt: new Date('2026-11-11T08:00:00-03:00'),
      endsAt: new Date('2026-11-11T08:30:00-03:00'),
      editable: false,
    })
    expect(describeAppointment(over, NOW).label).toBe('Concluído')
  })
})

describe('groupAppointments', () => {
  it('separa próximos (editáveis) de anteriores, mais recentes primeiro', () => {
    const upcoming = appt({
      code: 'A',
      startsAt: new Date('2026-11-14T13:30:00-03:00'),
      endsAt: new Date('2026-11-14T14:00:00-03:00'),
    })
    const cancelled = appt({
      code: 'B',
      status: 'CANCELLED',
      editable: false,
      startsAt: new Date('2026-11-04T09:00:00-03:00'),
      endsAt: new Date('2026-11-04T09:30:00-03:00'),
    })
    const old = appt({
      code: 'C',
      status: 'COMPLETED',
      editable: false,
      startsAt: new Date('2026-11-03T15:00:00-03:00'),
      endsAt: new Date('2026-11-03T15:30:00-03:00'),
    })
    const groups = groupAppointments([old, upcoming, cancelled], NOW)
    expect(groups.upcoming.map((item) => item.code)).toEqual(['A'])
    expect(groups.past.map((item) => item.code)).toEqual(['B', 'C'])
  })
})

import { describe, expect, it } from 'vitest'
import type { Professional } from '@/features/catalog/model/types'
import type { Slot } from '@/features/slots/model/types'
import { bookingReducer } from './bookingReducer'
import { isStepReachable, stepsFor } from './flow'
import { EMPTY_DRAFT, type BookingDraft } from './types'

const professional: Professional = {
  id: 'p1',
  name: 'Profa. Marina Seixas',
  role: 'COORDINATOR',
  courseCode: 'ADS',
  courseName: 'Análise e Desenv. de Sistemas',
  hasSlots: true,
}

const slot: Slot = {
  id: 's1',
  startsAt: new Date('2026-11-12T10:00:00-03:00'),
  endsAt: new Date('2026-11-12T10:30:00-03:00'),
  available: true,
}

function withSelections(): BookingDraft {
  let state = bookingReducer(EMPTY_DRAFT, { type: 'chooseType', attendanceType: 'PROFESSOR' })
  state = bookingReducer(state, { type: 'chooseProfessional', professional })
  state = bookingReducer(state, { type: 'chooseSlot', slot })
  return bookingReducer(state, { type: 'setReason', reason: 'Dúvida sobre a prova' })
}

describe('bookingReducer', () => {
  it('quando o horário fica indisponível, limpa só o horário e mantém o motivo (RF-12)', () => {
    const state = bookingReducer(withSelections(), { type: 'slotUnavailable' })
    expect(state.slot).toBeNull()
    expect(state.reason).toBe('Dúvida sobre a prova')
    expect(state.type).toBe('PROFESSOR')
    expect(state.professional?.id).toBe('p1')
  })

  it('trocar o tipo invalida responsável e horário', () => {
    const state = bookingReducer(withSelections(), { type: 'chooseType', attendanceType: 'CRA' })
    expect(state.professional).toBeNull()
    expect(state.slot).toBeNull()
  })
})

describe('fluxo por tipo', () => {
  it('CRA tem três passos e não exige responsável', () => {
    expect(stepsFor('CRA')).toEqual(['type', 'slot', 'review'])
    const draft = bookingReducer(EMPTY_DRAFT, { type: 'chooseType', attendanceType: 'CRA' })
    expect(isStepReachable('slot', draft)).toBe(true)
    expect(isStepReachable('professional', draft)).toBe(false)
  })

  it('Professor exige responsável antes do horário', () => {
    expect(stepsFor('PROFESSOR')).toEqual(['type', 'professional', 'slot', 'review'])
    const draft = bookingReducer(EMPTY_DRAFT, { type: 'chooseType', attendanceType: 'PROFESSOR' })
    expect(isStepReachable('slot', draft)).toBe(false)
  })
})

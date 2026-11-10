// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { appointmentsApi } from '@/features/appointments/api/appointmentsApi'
import { ApiError } from '@/lib/http/apiClient'
import { BookingProvider } from './BookingProvider'
import { useBookingViewModel } from './useBookingViewModel'

vi.mock('@/features/appointments/api/appointmentsApi', () => ({
  appointmentsApi: { create: vi.fn() },
}))

function wrapper({ children }: { children: ReactNode }) {
  return <BookingProvider>{children}</BookingProvider>
}

const professional = {
  id: 'p1',
  name: 'Prof. Rafael Cardoso',
  role: 'PROFESSOR' as const,
  courseCode: null,
  courseName: null,
  hasSlots: true,
}

const slot = {
  id: 's1',
  startsAt: new Date('2026-11-12T10:00:00-03:00'),
  endsAt: new Date('2026-11-12T10:30:00-03:00'),
  available: true,
}

type VM = ReturnType<typeof useBookingViewModel>

function fillDraft(vm: { current: VM }) {
  act(() => {
    vm.current.chooseType('PROFESSOR')
    vm.current.chooseProfessional(professional)
    vm.current.chooseSlot(slot)
    vm.current.setReason('Dúvida sobre a prova')
  })
}

describe('useBookingViewModel.submit', () => {
  beforeEach(() => {
    vi.mocked(appointmentsApi.create).mockReset()
  })

  it('409 SLOT_UNAVAILABLE devolve slot-unavailable, limpa o horário e mantém o motivo (RF-12)', async () => {
    vi.mocked(appointmentsApi.create).mockRejectedValue(
      new ApiError(409, 'SLOT_UNAVAILABLE', 'Esse horário acabou de ser ocupado.'),
    )
    const { result } = renderHook(() => useBookingViewModel(), { wrapper })
    fillDraft(result)

    let outcome: Awaited<ReturnType<VM['submit']>> | undefined
    await act(async () => {
      outcome = await result.current.submit()
    })

    expect(outcome).toEqual({ kind: 'slot-unavailable' })
    expect(result.current.draft.slot).toBeNull()
    expect(result.current.draft.reason).toBe('Dúvida sobre a prova')
    expect(result.current.draft.professional?.id).toBe('p1')
  })

  it('envia o motivo sem espaços das pontas e devolve o código no sucesso', async () => {
    vi.mocked(appointmentsApi.create).mockResolvedValue({
      code: 'AGD-2026-552',
      status: 'CONFIRMED',
      type: 'PROFESSOR',
      professional: null,
      startsAt: slot.startsAt,
      endsAt: slot.endsAt,
      reason: 'Dúvida sobre a prova',
      editable: true,
    })
    const { result } = renderHook(() => useBookingViewModel(), { wrapper })
    fillDraft(result)
    act(() => result.current.setReason('   Dúvida sobre a prova  '))

    let outcome: Awaited<ReturnType<VM['submit']>> | undefined
    await act(async () => {
      outcome = await result.current.submit()
    })

    expect(appointmentsApi.create).toHaveBeenCalledWith({ slotId: 's1', reason: 'Dúvida sobre a prova' })
    expect(outcome).toEqual({ kind: 'confirmed', code: 'AGD-2026-552' })
  })
})

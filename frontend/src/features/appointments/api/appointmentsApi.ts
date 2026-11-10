import { apiRequest } from '@/lib/http/apiClient'
import { toAppointment, type Appointment, type AppointmentDto } from '../model/types'

export interface CreateAppointmentInput {
  slotId: string
  reason: string | null
}

export const appointmentsApi = {
  create: async (input: CreateAppointmentInput): Promise<Appointment> =>
    toAppointment(await apiRequest<AppointmentDto>('/appointments', { method: 'POST', body: input })),

  listMine: async (): Promise<Appointment[]> =>
    (await apiRequest<AppointmentDto[]>('/appointments/me')).map(toAppointment),

  get: async (code: string): Promise<Appointment> =>
    toAppointment(await apiRequest<AppointmentDto>(`/appointments/${encodeURIComponent(code)}`)),

  cancel: async (code: string): Promise<Appointment> =>
    toAppointment(
      await apiRequest<AppointmentDto>(`/appointments/${encodeURIComponent(code)}/cancel`, { method: 'POST' }),
    ),

  reschedule: async (code: string, slotId: string): Promise<Appointment> =>
    toAppointment(
      await apiRequest<AppointmentDto>(`/appointments/${encodeURIComponent(code)}/reschedule`, {
        method: 'POST',
        body: { slotId },
      }),
    ),
}

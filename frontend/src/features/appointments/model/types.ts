import type { AttendanceType } from '@/domain/attendance'
import type { ProfessionalRole } from '@/features/catalog/model/types'

/** Espelha docs/api.md > Appointment. `COMPLETED` é derivado pelo servidor. */
export type AppointmentStatus = 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'

export interface ProfessionalRefDto {
  id: string
  name: string
  role: ProfessionalRole
  courseCode: string | null
  courseName: string | null
}

export interface AppointmentDto {
  code: string
  status: AppointmentStatus
  type: AttendanceType
  professional: ProfessionalRefDto | null
  startsAt: string
  endsAt: string
  reason: string | null
  editable: boolean
}

export interface Appointment {
  code: string
  status: AppointmentStatus
  type: AttendanceType
  professional: ProfessionalRefDto | null
  startsAt: Date
  endsAt: Date
  reason: string | null
  /** Vem do servidor. Não recalcular no cliente. */
  editable: boolean
}

export function toAppointment(dto: AppointmentDto): Appointment {
  return {
    code: dto.code,
    status: dto.status,
    type: dto.type,
    professional: dto.professional,
    startsAt: new Date(dto.startsAt),
    endsAt: new Date(dto.endsAt),
    reason: dto.reason,
    editable: dto.editable,
  }
}

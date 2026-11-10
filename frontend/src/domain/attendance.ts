/** Tipos de atendimento do contrato (docs/api.md, enumeração AttendanceType). */
export type AttendanceType = 'COORDINATION' | 'PROFESSOR' | 'CRA'

export interface AttendanceOption {
  type: AttendanceType
  label: string
  description: string
  /** CRA não tem responsável: pula o passo de escolha de pessoa. */
  needsProfessional: boolean
}

export const ATTENDANCE_OPTIONS: readonly AttendanceOption[] = [
  {
    type: 'COORDINATION',
    label: 'Coordenação',
    description: 'Matrícula, aproveitamento de estudos, grade curricular e questões do curso.',
    needsProfessional: true,
  },
  {
    type: 'PROFESSOR',
    label: 'Professor',
    description: 'Dúvidas de disciplina, orientação de trabalhos e revisão de nota.',
    needsProfessional: true,
  },
  {
    type: 'CRA',
    label: 'CRA',
    description: 'Central de Relacionamento com o Aluno: documentos, declarações e atendimento geral.',
    needsProfessional: false,
  },
]

export function attendanceOption(type: AttendanceType): AttendanceOption {
  const option = ATTENDANCE_OPTIONS.find((item) => item.type === type)
  if (!option) throw new Error(`Tipo de atendimento desconhecido: ${type}`)
  return option
}

export function attendanceLabel(type: AttendanceType): string {
  return attendanceOption(type).label
}

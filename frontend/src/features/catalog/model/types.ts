/** Espelha docs/api.md > GET /courses e GET /professionals. */
export interface CourseDto {
  code: string
  name: string
}

export interface ProfessionalDto {
  id: string
  name: string
  role: 'PROFESSOR' | 'COORDINATOR'
  courseCode: string | null
  courseName: string | null
  hasSlots: boolean
}

export type ProfessionalRole = 'PROFESSOR' | 'COORDINATOR'

export interface Course {
  code: string
  name: string
}

/** Modelo de apresentação do responsável (professor ou coordenador). */
export interface Professional {
  id: string
  name: string
  role: ProfessionalRole
  courseCode: string | null
  courseName: string | null
  hasSlots: boolean
}

export function toProfessional(dto: ProfessionalDto): Professional {
  return {
    id: dto.id,
    name: dto.name,
    role: dto.role,
    courseCode: dto.courseCode,
    courseName: dto.courseName,
    hasSlots: dto.hasSlots,
  }
}

/** Iniciais para o avatar do card ("Profa. Marina Seixas" -> "MS"). */
export function initialsOf(name: string): string {
  const words = name
    .replace(/^(Prof\.|Profa\.)\s*/i, '')
    .split(/\s+/)
    .filter(Boolean)
  const first = words[0]?.[0] ?? ''
  const last = words.length > 1 ? (words[words.length - 1]?.[0] ?? '') : ''
  return (first + last).toUpperCase()
}

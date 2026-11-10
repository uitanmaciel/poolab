import type { FieldError } from '@/lib/http/apiClient'
import type { RegisterErrors, RegisterInput } from './types'

/** Regras espelhadas de docs/api.md > POST /auth/register. O servidor continua sendo a fonte de verdade. */
export const UCSAL_DOMAIN = '@ucsal.edu.br'
const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ENROLLMENT_FORMAT = /^\d{4,20}$/

export const NAME_MIN = 3
export const NAME_MAX = 120
export const PASSWORD_MIN = 8
export const PASSWORD_MAX = 72

/** Domínio da UCSal. Valida formato, não identidade (PRD RF-02). */
export function isUcsalEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase()
  return (
    EMAIL_FORMAT.test(normalized) &&
    normalized.endsWith(UCSAL_DOMAIN) &&
    normalized.length > UCSAL_DOMAIN.length
  )
}

export function validateRegister(input: RegisterInput): RegisterErrors {
  const errors: RegisterErrors = {}
  const name = input.fullName.trim()

  if (name.length < NAME_MIN || name.length > NAME_MAX) {
    errors.fullName = `Informe o nome completo (de ${NAME_MIN} a ${NAME_MAX} caracteres).`
  }
  if (!ENROLLMENT_FORMAT.test(input.enrollment.trim())) {
    errors.enrollment = 'A matrícula deve ter de 4 a 20 números.'
  }
  if (!input.courseCode) {
    errors.courseCode = 'Escolha o curso.'
  }
  if (!EMAIL_FORMAT.test(input.email.trim())) {
    errors.email = `Informe um e-mail válido, terminado em ${UCSAL_DOMAIN}.`
  } else if (!isUcsalEmail(input.email)) {
    errors.email = `Use o e-mail institucional terminado em ${UCSAL_DOMAIN}.`
  }
  if (input.password.length < PASSWORD_MIN || input.password.length > PASSWORD_MAX) {
    errors.password = `A senha deve ter de ${PASSWORD_MIN} a ${PASSWORD_MAX} caracteres.`
  }

  return errors
}

const SERVER_FIELD_MESSAGES: Partial<Record<string, string>> = {
  email: `Use o e-mail institucional terminado em ${UCSAL_DOMAIN}.`,
}

/** Converte `details` do erro 400 VALIDATION_ERROR em erros por campo. */
export function mapServerFieldErrors(details: FieldError[]): RegisterErrors {
  const errors: RegisterErrors = {}
  for (const detail of details) {
    const field = detail.field as keyof RegisterInput
    if (field in { fullName: 1, enrollment: 1, courseCode: 1, email: 1, password: 1 }) {
      errors[field] = SERVER_FIELD_MESSAGES[field] ?? detail.message
    }
  }
  return errors
}

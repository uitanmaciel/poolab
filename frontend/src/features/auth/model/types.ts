/** Espelha `user` e `AuthResponse` de docs/api.md (POST /auth/register, /auth/login, GET /auth/me). */
export interface User {
  id: string
  fullName: string
  enrollment: string
  courseCode: string
  email: string
}

export interface AuthSession {
  token: string
  user: User
}

export interface RegisterInput {
  fullName: string
  enrollment: string
  courseCode: string
  email: string
  password: string
}

export type RegisterField = keyof RegisterInput
export type RegisterErrors = Partial<Record<RegisterField, string>>

import { createContext } from 'react'
import type { RegisterInput, User } from '../model/types'

export type SessionStatus = 'loading' | 'anonymous' | 'authenticated'

export interface AuthContextValue {
  status: SessionStatus
  user: User | null
  /** Mensagem a mostrar na tela de entrada (ex.: sessão expirada). */
  sessionMessage: string | null
  login: (email: string, password: string) => Promise<void>
  register: (input: RegisterInput) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

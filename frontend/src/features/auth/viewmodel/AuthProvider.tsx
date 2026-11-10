import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ApiError, AUTH_EXPIRED_EVENT } from '@/lib/http/apiClient'
import { clearToken, readToken, writeToken } from '@/lib/storage/session'
import { authApi } from '../api/authApi'
import type { RegisterInput, User } from '../model/types'
import { AuthContext, type AuthContextValue, type SessionStatus } from './AuthContext'

interface SessionState {
  status: SessionStatus
  user: User | null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionState>(() => ({
    status: readToken() ? 'loading' : 'anonymous',
    user: null,
  }))
  const [sessionMessage, setSessionMessage] = useState<string | null>(null)

  // Restaura a sessão ao abrir a página com um token salvo.
  useEffect(() => {
    if (!readToken()) return
    let active = true
    authApi
      .me()
      .then((user) => {
        if (active) setSession({ status: 'authenticated', user })
      })
      .catch((error: unknown) => {
        if (!active) return
        // Só descarta o token se o servidor recusou; falha de rede mantém o token.
        if (error instanceof ApiError && error.status === 401) clearToken()
        setSession({ status: 'anonymous', user: null })
      })
    return () => {
      active = false
    }
  }, [])

  // Qualquer 401 fora de login/cadastro encerra a sessão (ver apiClient).
  useEffect(() => {
    const onExpired = () => {
      clearToken()
      setSession({ status: 'anonymous', user: null })
      setSessionMessage('Sua sessão expirou. Entre novamente para continuar.')
    }
    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired)
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired)
  }, [])

  const startSession = useCallback((token: string, user: User) => {
    writeToken(token)
    setSessionMessage(null)
    setSession({ status: 'authenticated', user })
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await authApi.login(email, password)
      startSession(result.token, result.user)
    },
    [startSession],
  )

  const register = useCallback(
    async (input: RegisterInput) => {
      const result = await authApi.register(input)
      startSession(result.token, result.user)
    },
    [startSession],
  )

  const logout = useCallback(() => {
    clearToken()
    setSessionMessage(null)
    setSession({ status: 'anonymous', user: null })
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      status: session.status,
      user: session.user,
      sessionMessage,
      login,
      register,
      logout,
    }),
    [session, sessionMessage, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

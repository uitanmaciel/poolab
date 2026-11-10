const TOKEN_KEY = 'agenda-facil.token'

/** Fallback em memória para quando o localStorage está bloqueado (aba privada, política do navegador). */
let memoryToken: string | null = null

export function readToken(): string | null {
  if (memoryToken) return memoryToken
  try {
    return window.localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function writeToken(token: string): void {
  memoryToken = token
  try {
    window.localStorage.setItem(TOKEN_KEY, token)
  } catch {
    // Sem armazenamento persistente: a sessão vale só enquanto a página estiver aberta.
  }
}

export function clearToken(): void {
  memoryToken = null
  try {
    window.localStorage.removeItem(TOKEN_KEY)
  } catch {
    // Nada a limpar se o armazenamento não está disponível.
  }
}

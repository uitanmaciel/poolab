import { env } from '@/lib/env'
import { readToken } from '@/lib/storage/session'

export interface FieldError {
  field: string
  message: string
}

/** Erro padrão do contrato (docs/api.md). `status` 0 = falha de rede. */
export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly details: FieldError[]

  constructor(status: number, code: string, message: string, details: FieldError[] = []) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

export const NETWORK_ERROR = 'NETWORK_ERROR'
export const AUTH_EXPIRED_EVENT = 'auth:expired'

export interface RequestOptions {
  method?: 'GET' | 'POST'
  body?: unknown
  /** Login e cadastro retornam 401 com significado próprio; não devem expirar a sessão. */
  expireSessionOn401?: boolean
}

interface ErrorPayload {
  code?: string
  message?: string
  details?: FieldError[]
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, expireSessionOn401 = true } = options

  const headers: Record<string, string> = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const token = readToken()
  if (token) headers.Authorization = `Bearer ${token}`

  let response: Response
  try {
    response = await fetch(`${env.apiUrl}/api/v1${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError(0, NETWORK_ERROR, 'Não foi possível conectar ao servidor. Tente novamente em instantes.')
  }

  if (response.status === 204) return undefined as T

  const payload = (await response.json().catch(() => null)) as ErrorPayload | T | null

  if (!response.ok) {
    const error = (payload ?? {}) as ErrorPayload
    if (response.status === 401 && expireSessionOn401) {
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT))
    }
    throw new ApiError(
      response.status,
      error.code ?? 'UNKNOWN',
      error.message ?? 'Algo deu errado. Tente novamente.',
      error.details ?? [],
    )
  }

  return payload as T
}

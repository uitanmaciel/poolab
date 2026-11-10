import { apiRequest } from '@/lib/http/apiClient'
import type { AuthSession, RegisterInput, User } from '../model/types'

export const authApi = {
  register: (input: RegisterInput) =>
    apiRequest<AuthSession>('/auth/register', { method: 'POST', body: input, expireSessionOn401: false }),

  login: (email: string, password: string) =>
    apiRequest<AuthSession>('/auth/login', {
      method: 'POST',
      body: { email, password },
      expireSessionOn401: false,
    }),

  me: () => apiRequest<User>('/auth/me'),
}

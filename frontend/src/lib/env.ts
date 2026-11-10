/**
 * Variáveis públicas do Vite (VITE_*). Vão para o bundle: nunca colocar segredos aqui.
 */
export const env = {
  /** Vazio = mesma origem, via proxy /api do Vite. */
  apiUrl: (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, ''),
  /** E-mail da conta demo. A senha é digitada pelo usuário. */
  demoEmail: (import.meta.env.VITE_DEMO_EMAIL ?? '').trim().toLowerCase(),
} as const

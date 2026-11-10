import { useState, type FormEvent } from 'react'
import { ApiError } from '@/lib/http/apiClient'
import { env } from '@/lib/env'
import { useAuth } from './useAuth'

export interface LoginFieldErrors {
  email?: string
  password?: string
}

export function useLoginViewModel() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function validate(): LoginFieldErrors {
    const errors: LoginFieldErrors = {}
    if (!email.trim()) errors.email = 'Informe seu e-mail.'
    if (!password) errors.password = 'Informe sua senha.'
    return errors
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)
    const errors = validate()
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setSubmitting(true)
    try {
      await login(email.trim(), password)
    } catch (error) {
      setFormError(loginErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  /** Preenche só o e-mail da conta demo. A senha não é guardada no código. */
  function fillDemoAccount() {
    if (!env.demoEmail) return
    setEmail(env.demoEmail)
    setFieldErrors((current) => ({ ...current, email: undefined }))
    setFormError(null)
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    fieldErrors,
    formError,
    submitting,
    submit,
    fillDemoAccount,
    demoAccountEnabled: env.demoEmail.length > 0,
  }
}

export function loginErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 401) return 'E-mail ou senha incorretos. Confira os dados e tente de novo.'
    return error.message
  }
  return 'Não foi possível entrar agora. Tente novamente.'
}

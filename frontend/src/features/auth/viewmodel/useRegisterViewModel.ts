import { useState, type FormEvent } from 'react'
import { ApiError } from '@/lib/http/apiClient'
import { useCoursesViewModel } from '@/features/catalog/viewmodel/useCoursesViewModel'
import { mapServerFieldErrors, validateRegister } from '../model/validation'
import type { RegisterErrors, RegisterInput } from '../model/types'
import { useAuth } from './useAuth'

const EMPTY_FORM: RegisterInput = {
  fullName: '',
  enrollment: '',
  courseCode: '',
  email: '',
  password: '',
}

export function useRegisterViewModel() {
  const { register } = useAuth()
  const courses = useCoursesViewModel()
  const [form, setForm] = useState<RegisterInput>(EMPTY_FORM)
  const [errors, setErrors] = useState<RegisterErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function update<K extends keyof RegisterInput>(field: K, value: RegisterInput[K]) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  /** Validação de domínio ao sair do campo de e-mail, para avisar antes do envio. */
  function checkEmail() {
    const validation = validateRegister({ ...form })
    if (validation.email) setErrors((current) => ({ ...current, email: validation.email }))
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)
    const clientErrors = validateRegister(form)
    setErrors(clientErrors)
    if (Object.keys(clientErrors).length > 0) return

    setSubmitting(true)
    try {
      await register({
        ...form,
        fullName: form.fullName.trim(),
        enrollment: form.enrollment.trim(),
        email: form.email.trim().toLowerCase(),
      })
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.code === 'EMAIL_ALREADY_REGISTERED') {
          setErrors({ email: 'Já existe uma conta com este e-mail. Tente entrar.' })
        } else if (error.code === 'INVALID_EMAIL_DOMAIN') {
          setErrors({ email: 'Use o e-mail institucional terminado em @ucsal.edu.br.' })
        } else if (error.code === 'VALIDATION_ERROR' && error.details.length > 0) {
          setErrors(mapServerFieldErrors(error.details))
        } else {
          setFormError(error.message)
        }
      } else {
        setFormError('Não foi possível criar a conta agora. Tente novamente.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return { form, update, errors, formError, submitting, submit, checkEmail, courses }
}

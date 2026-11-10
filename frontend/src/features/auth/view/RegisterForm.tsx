import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ErrorAlert } from '@/components/ErrorAlert'
import { FormField } from '@/components/FormField'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LoadErrorState, LoadingState } from '@/components/StateMessage'
import { PASSWORD_MAX, PASSWORD_MIN, NAME_MAX } from '../model/validation'
import type { useRegisterViewModel } from '../viewmodel/useRegisterViewModel'

type RegisterVM = ReturnType<typeof useRegisterViewModel>

export function RegisterForm(vm: RegisterVM) {
  const { form, errors, update, courses } = vm

  return (
    <form onSubmit={vm.submit} noValidate className="flex flex-col gap-4">
      {vm.formError ? <ErrorAlert title="Não foi possível criar a conta">{vm.formError}</ErrorAlert> : null}

      <FormField id="reg-name" label="Nome completo" error={errors.fullName}>
        <Input
          id="reg-name"
          autoComplete="name"
          maxLength={NAME_MAX}
          value={form.fullName}
          onChange={(event) => update('fullName', event.target.value)}
          aria-invalid={errors.fullName ? true : undefined}
          aria-describedby={errors.fullName ? 'reg-name-error' : undefined}
        />
      </FormField>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField id="reg-enrollment" label="Matrícula" error={errors.enrollment} hint="Somente números (fictícia na demonstração)">
          <Input
            id="reg-enrollment"
            inputMode="numeric"
            maxLength={20}
            value={form.enrollment}
            onChange={(event) => update('enrollment', event.target.value.replace(/\D/g, ''))}
            aria-invalid={errors.enrollment ? true : undefined}
            aria-describedby={errors.enrollment ? 'reg-enrollment-error' : 'reg-enrollment-hint'}
            className="font-mono"
          />
        </FormField>

        <FormField id="reg-course" label="Curso" error={errors.courseCode}>
          {courses.status === 'loading' ? (
            <LoadingState label="Carregando cursos" lines={1} />
          ) : courses.status === 'error' ? (
            <LoadErrorState message={courses.error ?? 'Tente novamente.'} onRetry={() => window.location.reload()} />
          ) : (
            <Select value={form.courseCode} onValueChange={(value) => update('courseCode', value)}>
              <SelectTrigger id="reg-course" aria-invalid={errors.courseCode ? true : undefined} className="w-full">
                <SelectValue placeholder="Escolha seu curso" />
              </SelectTrigger>
              <SelectContent>
                {courses.courses.map((course) => (
                  <SelectItem key={course.code} value={course.code}>
                    {course.name} ({course.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </FormField>
      </div>

      <FormField
        id="reg-email"
        label="E-mail institucional"
        error={errors.email}
        hint="Precisa terminar em @ucsal.edu.br. Isso confere o formato, não comprova a identidade."
      >
        <Input
          id="reg-email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="nome@ucsal.edu.br"
          value={form.email}
          onChange={(event) => update('email', event.target.value)}
          onBlur={vm.checkEmail}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? 'reg-email-error' : 'reg-email-hint'}
        />
      </FormField>

      <FormField id="reg-password" label="Senha" error={errors.password} hint={`De ${PASSWORD_MIN} a ${PASSWORD_MAX} caracteres`}>
        <Input
          id="reg-password"
          type="password"
          autoComplete="new-password"
          maxLength={PASSWORD_MAX}
          value={form.password}
          onChange={(event) => update('password', event.target.value)}
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={errors.password ? 'reg-password-error' : 'reg-password-hint'}
        />
      </FormField>

      <Button type="submit" size="lg" disabled={vm.submitting}>
        {vm.submitting ? <Loader2 aria-hidden="true" className="animate-spin" /> : null}
        {vm.submitting ? 'Criando conta…' : 'Criar conta e continuar'}
      </Button>
    </form>
  )
}

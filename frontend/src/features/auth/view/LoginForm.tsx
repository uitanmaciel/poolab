import { FlaskConical, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ErrorAlert } from '@/components/ErrorAlert'
import { FormField } from '@/components/FormField'
import type { useLoginViewModel } from '../viewmodel/useLoginViewModel'

type LoginVM = ReturnType<typeof useLoginViewModel>

export function LoginForm(vm: LoginVM) {
  return (
    <form onSubmit={vm.submit} noValidate className="flex flex-col gap-4">
      {vm.formError ? <ErrorAlert title="Não foi possível entrar">{vm.formError}</ErrorAlert> : null}

      <FormField id="login-email" label="E-mail institucional" error={vm.fieldErrors.email}>
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="nome@ucsal.edu.br"
          value={vm.email}
          onChange={(event) => vm.setEmail(event.target.value)}
          aria-invalid={vm.fieldErrors.email ? true : undefined}
          aria-describedby={vm.fieldErrors.email ? 'login-email-error' : undefined}
        />
      </FormField>

      <FormField id="login-password" label="Senha" error={vm.fieldErrors.password}>
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={vm.password}
          onChange={(event) => vm.setPassword(event.target.value)}
          aria-invalid={vm.fieldErrors.password ? true : undefined}
          aria-describedby={vm.fieldErrors.password ? 'login-password-error' : undefined}
        />
      </FormField>

      <Button type="submit" size="lg" disabled={vm.submitting}>
        {vm.submitting ? <Loader2 aria-hidden="true" className="animate-spin" /> : null}
        {vm.submitting ? 'Entrando…' : 'Entrar'}
      </Button>

      {vm.demoAccountEnabled ? (
        <div className="flex flex-col gap-2 rounded-xl border-[1.5px] border-dashed border-border bg-secondary p-3.5">
          <p className="text-[13px] text-muted-foreground">
            Quer testar sem criar conta? Preencha o e-mail da conta de demonstração e use a senha informada pela equipe.
          </p>
          <Button type="button" variant="outline" className="w-fit" onClick={vm.fillDemoAccount}>
            <FlaskConical aria-hidden="true" />
            Usar conta de demonstração
          </Button>
        </div>
      ) : null}
    </form>
  )
}

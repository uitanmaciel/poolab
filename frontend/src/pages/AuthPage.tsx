import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { ErrorAlert } from '@/components/ErrorAlert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LoginForm } from '@/features/auth/view/LoginForm'
import { RegisterForm } from '@/features/auth/view/RegisterForm'
import { useAuth } from '@/features/auth/viewmodel/useAuth'
import { useLoginViewModel } from '@/features/auth/viewmodel/useLoginViewModel'
import { useRegisterViewModel } from '@/features/auth/viewmodel/useRegisterViewModel'

export function AuthPage() {
  const { status, sessionMessage } = useAuth()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/agendar'
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const login = useLoginViewModel()
  const register = useRegisterViewModel()

  if (status === 'authenticated') return <Navigate to={from} replace />

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground md:grid md:grid-cols-[480px_1fr]">
      <aside className="flex flex-col justify-between gap-8 bg-primary px-6 py-8 text-primary-foreground md:px-12 md:py-12">
        <div className="flex items-center gap-2.5">
          <span aria-hidden="true" className="flex size-8 items-center justify-center rounded-lg bg-white font-display text-[15px] font-bold text-primary">
            AF
          </span>
          <span className="font-display text-lg font-bold">Agenda Fácil Acadêmico</span>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="font-display text-3xl leading-tight font-bold tracking-tight md:text-[38px]">
            Marque seu atendimento em poucos passos.
          </h2>
          <p className="max-w-[340px] opacity-90">Coordenação, professor ou CRA. Escolha, confirme e receba um código.</p>
        </div>
        <p className="border-t border-white/35 pt-4 text-[13px] opacity-85">
          Protótipo acadêmico (POOALAB). Não é o login oficial da UCSal. Use somente dados fictícios.
        </p>
      </aside>

      <section className="flex flex-1 items-start justify-center px-4 py-8 md:items-center md:px-24 md:py-12">
        <div className="flex w-full max-w-[608px] flex-col gap-6">
          {sessionMessage ? <ErrorAlert tone="warning" title="Entre novamente">{sessionMessage}</ErrorAlert> : null}

          <Tabs value={tab} onValueChange={(value) => setTab(value as 'login' | 'register')}>
            <TabsList className="h-11 w-full bg-secondary md:w-auto">
              <TabsTrigger value="login" className="h-9 px-5 text-sm">
                Entrar
              </TabsTrigger>
              <TabsTrigger value="register" className="h-9 px-5 text-sm">
                Criar conta
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-6">
              <div className="flex flex-col gap-5">
                <h1 className="font-display text-[28px] font-bold leading-tight">Entrar na sua conta</h1>
                <LoginForm {...login} />
              </div>
            </TabsContent>

            <TabsContent value="register" className="mt-6">
              <div className="flex flex-col gap-5">
                <h1 className="font-display text-[28px] font-bold leading-tight">Criar conta de demonstração</h1>
                <RegisterForm {...register} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}

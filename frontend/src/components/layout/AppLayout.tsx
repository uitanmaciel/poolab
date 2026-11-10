import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { AppHeader } from './AppHeader'
import { BottomTabs } from './BottomTabs'

interface AppLayoutProps {
  children: ReactNode
  /** Barra de ação fixa no rodapé (ex.: Voltar / Continuar). */
  footer?: ReactNode
  /** Mostra as abas inferiores no mobile (telas fora do fluxo de agendamento). */
  showTabs?: boolean
  /** Telas de sucesso usam o tema escuro (classe .dark no wrapper). */
  tone?: 'light' | 'dark'
  /** Largura de leitura: `narrow` para confirmações e erros centrados. */
  width?: 'wide' | 'narrow'
}

/** Casca comum: cabeçalho, conteúdo centralizado e rodapé de ação. */
export function AppLayout({ children, footer, showTabs = false, tone = 'light', width = 'wide' }: AppLayoutProps) {
  return (
    <div className={cn('flex min-h-dvh flex-col bg-background text-foreground', tone === 'dark' && 'dark')}>
      <AppHeader />
      <main
        className={cn(
          'mx-auto flex w-full flex-1 flex-col px-4 pt-6 md:px-12 md:pt-8',
          width === 'wide' ? 'max-w-[960px]' : 'max-w-[640px]',
          footer || showTabs ? 'pb-6' : 'pb-10',
        )}
      >
        {children}
      </main>
      {footer ? (
        <div className="sticky bottom-0 border-t border-border bg-card px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:px-12">
          <div className={cn('mx-auto flex w-full items-center justify-between gap-3', width === 'wide' ? 'max-w-[960px]' : 'max-w-[640px]')}>
            {footer}
          </div>
        </div>
      ) : null}
      {showTabs ? <BottomTabs /> : null}
    </div>
  )
}

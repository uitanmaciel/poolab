import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface StepActionsProps {
  onBack?: () => void
  backLabel?: string
  onContinue: () => void
  continueLabel?: string
  continueDisabled?: boolean
  loading?: boolean
}

/** Barra de ação do fluxo: Voltar à esquerda, Continuar (desabilitado sem seleção) à direita. */
export function StepActions({
  onBack,
  backLabel = 'Voltar',
  onContinue,
  continueLabel = 'Continuar',
  continueDisabled = false,
  loading = false,
}: StepActionsProps) {
  return (
    <>
      {onBack ? (
        <Button variant="outline" onClick={onBack} className="min-w-0">
          <ArrowLeft aria-hidden="true" />
          {backLabel}
        </Button>
      ) : (
        <span />
      )}
      <Button onClick={onContinue} disabled={continueDisabled || loading} className="min-w-0 flex-1 md:flex-none">
        {loading ? <Loader2 aria-hidden="true" className="animate-spin" /> : null}
        {continueLabel}
        {!loading ? <ArrowRight aria-hidden="true" /> : null}
      </Button>
    </>
  )
}

import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function NotFoundPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background p-6 text-center text-foreground">
      <h1 className="font-display text-3xl font-bold">Página não encontrada</h1>
      <p className="text-muted-foreground">O endereço que você abriu não existe.</p>
      <Link to="/agendar" className={cn(buttonVariants())}>
        Ir para o início
      </Link>
    </div>
  )
}

import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/features/auth/viewmodel/useAuth'

/** Rotas privadas: sem sessão, vai para a entrada e volta ao destino depois. */
export function RequireAuth() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <div role="status" className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-background p-6">
        <span className="sr-only">Verificando sua sessão</span>
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    )
  }
  if (status === 'anonymous') {
    return <Navigate to="/entrar" replace state={{ from: `${location.pathname}${location.search}` }} />
  }
  return <Outlet />
}

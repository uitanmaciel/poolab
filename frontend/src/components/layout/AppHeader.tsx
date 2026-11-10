import { LogOut } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/viewmodel/useAuth'
import { env } from '@/lib/env'
import { cn } from '@/lib/utils'
import { NAV_ITEMS } from './navItems'
import { initialsOf } from '@/features/catalog/model/types'

export function AppHeader() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const isDemo = Boolean(user && env.demoEmail && user.email.toLowerCase() === env.demoEmail)

  function handleLogout() {
    logout()
    navigate('/entrar', { replace: true })
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card">
      <div className="mx-auto flex h-14 w-full max-w-[960px] items-center justify-between gap-3 px-4 md:h-16 md:px-12">
        <div className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden="true"
            className="flex size-7 flex-none items-center justify-center rounded-lg bg-primary font-display text-sm font-bold text-primary-foreground"
          >
            AF
          </span>
          <span className="truncate font-display text-base font-bold md:text-lg">
            <span className="md:hidden">Agenda Fácil</span>
            <span className="hidden md:inline">Agenda Fácil Acadêmico</span>
          </span>
        </div>

        <nav aria-label="Principal" className="hidden items-stretch gap-6 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center border-b-[3px] border-transparent text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground',
                  isActive && 'border-primary text-primary',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {user ? (
          <div className="flex items-center gap-2 md:gap-3">
            <span className="hidden text-sm text-muted-foreground md:inline">
              {user.fullName}
              {isDemo ? ' (conta de demonstração)' : ''}
            </span>
            <span
              aria-hidden="true"
              className="flex size-8 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary"
            >
              {initialsOf(user.fullName)}
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout} aria-label="Sair da conta">
              <LogOut aria-hidden="true" />
              <span className="hidden md:inline">Sair</span>
            </Button>
          </div>
        ) : null}
      </div>
    </header>
  )
}

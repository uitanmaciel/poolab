import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { NAV_ITEMS } from './navItems'

/** Abas inferiores do mobile: somem no desktop, onde a navegação fica no cabeçalho. */
export function BottomTabs() {
  return (
    <nav
      aria-label="Principal"
      className="sticky bottom-0 z-30 grid grid-cols-2 border-t border-border bg-card pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 px-2 py-3 text-xs font-semibold text-muted-foreground',
                isActive && 'text-primary',
              )
            }
          >
            <Icon aria-hidden="true" className="size-5" />
            {item.label}
          </NavLink>
        )
      })}
    </nav>
  )
}

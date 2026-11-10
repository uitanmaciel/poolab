import { CalendarDays, Plus, type LucideIcon } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

export const NAV_ITEMS: readonly NavItem[] = [
  { to: '/agendar', label: 'Novo agendamento', icon: Plus },
  { to: '/agendamentos', label: 'Meus agendamentos', icon: CalendarDays },
]

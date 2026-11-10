import { SelectableCard } from './SelectableCard'
import { initialsOf, type Professional } from '@/features/catalog/model/types'

interface ProfessionalCardProps {
  professional: Professional
  selected: boolean
  onSelect: () => void
}

/** Card de responsável. Sem horários fica desabilitado com "Sem horários" (RF-07). */
export function ProfessionalCard({ professional, selected, onSelect }: ProfessionalCardProps) {
  const isCoordinator = professional.role === 'COORDINATOR'
  const course = professional.courseName
    ? `${professional.courseName}${professional.courseCode ? ` (${professional.courseCode})` : ''}`
    : null

  return (
    <SelectableCard
      selected={selected}
      disabled={!professional.hasSlots}
      onSelect={onSelect}
      avatar={initialsOf(professional.name)}
      title={professional.name}
      description={isCoordinator ? `Coordenação${course ? ` · ${course}` : ''}` : (course ?? 'Professor(a)')}
      badge={isCoordinator ? { label: 'Coordenação', tone: 'primary' } : undefined}
      disabledReason={professional.hasSlots ? undefined : 'Sem horários'}
    />
  )
}

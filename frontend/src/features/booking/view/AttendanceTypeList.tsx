import { SelectableCard } from '@/components/SelectableCard'
import { ATTENDANCE_OPTIONS, type AttendanceType } from '@/domain/attendance'

interface AttendanceTypeListProps {
  selected: AttendanceType | null
  onSelect: (type: AttendanceType) => void
}

const AVATAR: Record<AttendanceType, string> = { COORDINATION: 'C', PROFESSOR: 'P', CRA: 'R' }

const BADGE: Record<AttendanceType, { label: string; tone: 'primary' | 'success' }> = {
  COORDINATION: { label: 'Escolhe o coordenador', tone: 'primary' },
  PROFESSOR: { label: 'Escolhe o professor', tone: 'primary' },
  CRA: { label: 'Sem escolha de pessoa', tone: 'success' },
}

export function AttendanceTypeList({ selected, onSelect }: AttendanceTypeListProps) {
  return (
    <div role="radiogroup" aria-label="Tipo de atendimento" className="grid gap-4 md:grid-cols-3">
      {ATTENDANCE_OPTIONS.map((option) => (
        <SelectableCard
          key={option.type}
          selected={selected === option.type}
          onSelect={() => onSelect(option.type)}
          avatar={AVATAR[option.type]}
          title={option.label}
          description={option.description}
          badge={BADGE[option.type]}
        />
      ))}
    </div>
  )
}

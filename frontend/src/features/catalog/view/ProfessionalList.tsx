import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { LoadErrorState, LoadingState, EmptyState } from '@/components/StateMessage'
import { ProfessionalCard } from '@/components/ProfessionalCard'
import type { LoadStatus } from '@/features/catalog/viewmodel/useProfessionalsViewModel'
import type { Professional } from '@/features/catalog/model/types'

interface ProfessionalListProps {
  status: LoadStatus
  error: string | null
  items: Professional[]
  total: number
  query: string
  onQueryChange: (value: string) => void
  selectedId: string | null
  onSelect: (professional: Professional) => void
  onRetry: () => void
}

export function ProfessionalList({
  status,
  error,
  items,
  total,
  query,
  onQueryChange,
  selectedId,
  onSelect,
  onRetry,
}: ProfessionalListProps) {
  if (status === 'loading') return <LoadingState label="Carregando responsáveis" lines={4} />
  if (status === 'error') return <LoadErrorState message={error ?? 'Tente novamente.'} onRetry={onRetry} />

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full md:w-[300px] md:self-end">
        <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          aria-label="Buscar responsável por nome ou curso"
          placeholder="Buscar por nome ou curso"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          className="h-11 pl-9"
        />
      </div>

      {total === 0 ? (
        <EmptyState icon={<Search className="size-8" />} title="Nenhum responsável cadastrado" description="Volte e escolha outro tipo de atendimento." />
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum responsável encontrado para &ldquo;{query.trim()}&rdquo;.</p>
      ) : (
        <div role="radiogroup" aria-label="Responsáveis" className="grid gap-4 md:grid-cols-2">
          {items.map((professional) => (
            <ProfessionalCard
              key={professional.id}
              professional={professional}
              selected={professional.id === selectedId}
              onSelect={() => onSelect(professional)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

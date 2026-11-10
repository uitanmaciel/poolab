import { useNavigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageHeading } from '@/components/PageHeading'
import { StepActions } from '@/components/StepActions'
import { ProfessionalList } from '@/features/catalog/view/ProfessionalList'
import { useProfessionalsViewModel } from '@/features/catalog/viewmodel/useProfessionalsViewModel'
import { attendanceLabel, attendanceOption, type AttendanceType } from '@/domain/attendance'
import { BookingStepper } from '@/features/booking/view/BookingStepper'
import { RequireBookingStep } from '@/features/booking/view/RequireBookingStep'
import { BOOKING_PATHS, nextStep } from '@/features/booking/model/flow'
import { useBookingViewModel } from '@/features/booking/viewmodel/useBookingViewModel'

export function BookingProfessionalPage() {
  return (
    <RequireBookingStep step="professional">
      <ProfessionalStep />
    </RequireBookingStep>
  )
}

function ProfessionalStep() {
  const { draft, chooseProfessional } = useBookingViewModel()
  const navigate = useNavigate()
  // RequireBookingStep garante que o tipo existe e exige responsável.
  const type = draft.type as Exclude<AttendanceType, 'CRA'>
  const list = useProfessionalsViewModel(type)
  const next = nextStep('professional', type)

  return (
    <AppLayout
      footer={
        <StepActions
          onBack={() => navigate(BOOKING_PATHS.type)}
          onContinue={() => next && navigate(BOOKING_PATHS[next])}
          continueDisabled={draft.professional === null}
        />
      }
    >
      <div className="flex flex-col gap-6">
        <BookingStepper step="professional" type={type} />
        <PageHeading
          title={type === 'PROFESSOR' ? 'Escolha o professor' : 'Escolha o coordenador'}
          description={`Atendimento selecionado: ${attendanceLabel(type)}. ${attendanceOption(type).label === 'Professor' ? 'Cada pessoa tem horários próprios.' : 'Cada coordenação tem horários próprios.'}`}
        />
        <ProfessionalList
          status={list.status}
          error={list.error}
          items={list.items}
          total={list.total}
          query={list.query}
          onQueryChange={list.setQuery}
          selectedId={draft.professional?.id ?? null}
          onSelect={chooseProfessional}
          onRetry={list.reload}
        />
      </div>
    </AppLayout>
  )
}

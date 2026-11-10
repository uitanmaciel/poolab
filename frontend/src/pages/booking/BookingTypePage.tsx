import { useNavigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageHeading } from '@/components/PageHeading'
import { StepActions } from '@/components/StepActions'
import { AttendanceTypeList } from '@/features/booking/view/AttendanceTypeList'
import { BookingStepper } from '@/features/booking/view/BookingStepper'
import { BOOKING_PATHS, nextStep } from '@/features/booking/model/flow'
import { useBookingViewModel } from '@/features/booking/viewmodel/useBookingViewModel'

export function BookingTypePage() {
  const { draft, chooseType } = useBookingViewModel()
  const navigate = useNavigate()
  const next = nextStep('type', draft.type)

  return (
    <AppLayout
      footer={
        <StepActions
          onContinue={() => next && navigate(BOOKING_PATHS[next])}
          continueDisabled={draft.type === null}
        />
      }
    >
      <div className="flex flex-col gap-6">
        <BookingStepper step="type" type={draft.type} />
        <PageHeading
          title="Com quem você quer falar?"
          description="Escolha o tipo de atendimento. Você poderá revisar tudo antes de confirmar."
        />
        <AttendanceTypeList selected={draft.type} onSelect={chooseType} />
      </div>
    </AppLayout>
  )
}

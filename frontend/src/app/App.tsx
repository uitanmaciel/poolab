import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom'
import { AuthProvider } from '@/features/auth/viewmodel/AuthProvider'
import { BookingProvider } from '@/features/booking/viewmodel/BookingProvider'
import { AuthPage } from '@/pages/AuthPage'
import { BookingProfessionalPage } from '@/pages/booking/BookingProfessionalPage'
import { BookingReviewPage } from '@/pages/booking/BookingReviewPage'
import { BookingSlotPage } from '@/pages/booking/BookingSlotPage'
import { BookingSuccessPage } from '@/pages/booking/BookingSuccessPage'
import { BookingTypePage } from '@/pages/booking/BookingTypePage'
import { AppointmentErrorPage, CancelledPage, RescheduledPage } from '@/pages/appointments/AppointmentResultPages'
import { MyAppointmentsPage } from '@/pages/appointments/MyAppointmentsPage'
import { ReschedulePage } from '@/pages/appointments/ReschedulePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { RequireAuth } from './RequireAuth'

const router = createBrowserRouter([
  {
    // Raiz: sessão e rotas públicas e privadas compartilham o AuthProvider.
    element: (
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    ),
    children: [
      { path: '/entrar', element: <AuthPage /> },
      {
        element: <RequireAuth />,
        children: [
          {
            // O rascunho do agendamento sobrevive entre /agendar e as etapas seguintes.
            element: (
              <BookingProvider>
                <Outlet />
              </BookingProvider>
            ),
            children: [
              { path: '/', element: <Navigate to="/agendar" replace /> },
              { path: '/agendar', element: <BookingTypePage /> },
              { path: '/agendar/responsavel', element: <BookingProfessionalPage /> },
              { path: '/agendar/horario', element: <BookingSlotPage /> },
              { path: '/agendar/revisao', element: <BookingReviewPage /> },
              { path: '/confirmacao/:code', element: <BookingSuccessPage /> },
              { path: '/agendamentos', element: <MyAppointmentsPage /> },
              { path: '/agendamentos/:code/reagendar', element: <ReschedulePage /> },
              { path: '/agendamentos/:code/reagendado', element: <RescheduledPage /> },
              { path: '/agendamentos/:code/cancelado', element: <CancelledPage /> },
              { path: '/agendamentos/:code/erro/:motivo', element: <AppointmentErrorPage /> },
              { path: '*', element: <NotFoundPage /> },
            ],
          },
        ],
      },
    ],
  },
])

export function App() {
  return <RouterProvider router={router} />
}

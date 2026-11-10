import { useMemo, useReducer, type ReactNode } from 'react'
import { bookingReducer } from '../model/bookingReducer'
import { EMPTY_DRAFT } from '../model/types'
import { BookingContext, type BookingContextValue } from './BookingContext'

/** Mantém o rascunho entre as telas do fluxo (/agendar/*). */
export function BookingProvider({ children }: { children: ReactNode }) {
  const [draft, dispatch] = useReducer(bookingReducer, EMPTY_DRAFT)
  const value = useMemo<BookingContextValue>(() => ({ draft, dispatch }), [draft])
  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

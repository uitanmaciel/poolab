import { createContext, type Dispatch } from 'react'
import type { BookingAction } from '../model/bookingReducer'
import type { BookingDraft } from '../model/types'

export interface BookingContextValue {
  draft: BookingDraft
  dispatch: Dispatch<BookingAction>
}

export const BookingContext = createContext<BookingContextValue | null>(null)

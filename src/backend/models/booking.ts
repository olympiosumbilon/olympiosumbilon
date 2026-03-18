export type BookingPayload = {
  slotId?: number
  email?: string
}

export type BookingRequest = {
  slotId: number
  email: string
}

export type BookingSlot = {
  id: number | string
  slot_date: string
  start_time: string
  end_time: string
}

export type BookingResult = {
  status: number
  body: Record<string, unknown>
}

import { NextResponse } from 'next/server'
import type { BookingPayload } from '@/backend/models/booking'
import { createWebsiteBooking, getPublicBookingSlots } from '@/backend/services/bookingService'
import { BOOKING_CONSTANTS } from '@/backend/constants/booking'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function normalizeBookingPayload(payload: BookingPayload) {
  return {
    slotId: Number(payload.slotId),
    email: (payload.email || '').trim().toLowerCase(),
  }
}

function getBookingValidationMessage(slotId: number, email: string) {
  if (!Number.isInteger(slotId) || slotId <= 0 || !EMAIL_PATTERN.test(email)) {
    return 'A valid slot and email are required.'
  }

  return null
}

async function parseBookingPayload(request: Request) {
  try {
    return (await request.json()) as BookingPayload
  } catch {
    return null
  }
}

export async function handleBookingPost(request: Request) {
  const payload = await parseBookingPayload(request)
  if (!payload) {
    return NextResponse.json({ message: 'Invalid booking payload.' }, { status: 400 })
  }

  const { slotId, email } = normalizeBookingPayload(payload)
  const validationMessage = getBookingValidationMessage(slotId, email)
  if (validationMessage) {
    return NextResponse.json({ message: validationMessage }, { status: 400 })
  }

  const result = await createWebsiteBooking({ slotId, email })
  return NextResponse.json(result.body, { status: result.status })
}

export async function handleBookingSlotsGet(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const requestedDays = Number(searchParams.get('days') || BOOKING_CONSTANTS.defaultWindowDays)
    const slots = await getPublicBookingSlots(requestedDays)

    return NextResponse.json({ slots }, { status: 200 })
  } catch (error) {
    console.error('Failed to load booking slots:', error)
    return NextResponse.json({ message: 'Failed to load booking slots.' }, { status: 500 })
  }
}

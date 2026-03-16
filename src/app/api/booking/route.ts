import { NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase/server'

type BookingPayload = {
  slotId?: number
  email?: string
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  const supabase = getSupabaseAdminClient()

  if (!supabase) {
    return NextResponse.json({ message: 'Supabase is not configured.' }, { status: 500 })
  }

  let body: BookingPayload

  try {
    body = (await request.json()) as BookingPayload
  } catch {
    return NextResponse.json({ message: 'Invalid booking payload.' }, { status: 400 })
  }

  const slotId = Number(body.slotId)
  const email = (body.email || '').trim().toLowerCase()

  if (!Number.isInteger(slotId) || slotId <= 0 || !emailPattern.test(email)) {
    return NextResponse.json({ message: 'A valid slot and email are required.' }, { status: 400 })
  }

  const { data: lockedSlots, error: lockError } = await supabase
    .from('available_slots')
    .update({ is_booked: true })
    .eq('id', slotId)
    .eq('is_booked', false)
    .select('id, slot_date, start_time, end_time')

  if (lockError) {
    console.error('Failed to lock booking slot:', lockError)
    return NextResponse.json({ message: 'Failed to reserve the selected slot.' }, { status: 500 })
  }

  const lockedSlot = lockedSlots?.[0]

  if (!lockedSlot) {
    return NextResponse.json({ message: 'That slot has already been booked. Please choose another one.' }, { status: 409 })
  }

  const releaseLockedSlot = async () => {
    await supabase
      .from('available_slots')
      .update({ is_booked: false, booking_id: null })
      .eq('id', lockedSlot.id)
  }

  try {
    const { data: contact, error: contactError } = await supabase
      .from('contacts')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (contactError) {
      throw contactError
    }

    if (!contact?.id) {
      await releaseLockedSlot()
      return NextResponse.json(
        { message: 'Your lead record is not ready yet. Please wait a few seconds and try again.' },
        { status: 409 }
      )
    }

    const { data: formSubmission, error: formSubmissionError } = await supabase
      .from('form_submissions')
      .select('id')
      .eq('contact_id', contact.id)
      .order('submitted_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (formSubmissionError) {
      throw formSubmissionError
    }

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        contact_id: contact.id,
        form_submission_id: formSubmission?.id ?? null,
        slot_id: lockedSlot.id,
        status: 'scheduled',
      })
      .select('id')
      .single()

    if (bookingError || !booking) {
      throw bookingError || new Error('Booking record was not created.')
    }

    const { error: slotUpdateError } = await supabase
      .from('available_slots')
      .update({ booking_id: booking.id })
      .eq('id', lockedSlot.id)

    if (slotUpdateError) {
      throw slotUpdateError
    }

    const { error: activityError } = await supabase.from('activities').insert({
      contact_id: contact.id,
      type: 'Booking',
      outcome: 'Audit Call Scheduled',
      notes: `Website booking scheduled for ${lockedSlot.slot_date} ${lockedSlot.start_time}-${lockedSlot.end_time}`,
      booking_id: booking.id,
    })

    if (activityError) {
      throw activityError
    }

    return NextResponse.json(
      {
        message: 'Booking confirmed.',
        bookingId: booking.id,
        slot: lockedSlot,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Failed to create booking:', error)

    await releaseLockedSlot()

    return NextResponse.json(
      { message: 'We could not finalize your booking. Please try another slot.' },
      { status: 500 }
    )
  }
}

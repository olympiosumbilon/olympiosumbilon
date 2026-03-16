import { NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase/server'

const MANILA_TIME_ZONE = 'Asia/Manila'
const DEFAULT_WINDOW_DAYS = 14
const MAX_WINDOW_DAYS = 30

const getTodayInManila = () =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: MANILA_TIME_ZONE,
  }).format(new Date())

export async function GET(request: Request) {
  const supabase = getSupabaseAdminClient()

  if (!supabase) {
    return NextResponse.json({ message: 'Supabase is not configured.' }, { status: 500 })
  }

  const { searchParams } = new URL(request.url)
  const requestedDays = Number(searchParams.get('days') || DEFAULT_WINDOW_DAYS)
  const days = Number.isFinite(requestedDays)
    ? Math.min(Math.max(Math.trunc(requestedDays), 1), MAX_WINDOW_DAYS)
    : DEFAULT_WINDOW_DAYS

  const today = getTodayInManila()

  const { data, error } = await supabase
    .from('available_slots')
    .select('id, slot_date, start_time, end_time')
    .eq('is_booked', false)
    .gte('slot_date', today)
    .order('slot_date', { ascending: true })
    .order('start_time', { ascending: true })
    .limit(days * 12)

  if (error) {
    console.error('Failed to load booking slots:', error)
    return NextResponse.json({ message: 'Failed to load booking slots.' }, { status: 500 })
  }

  return NextResponse.json({ slots: data ?? [] }, { status: 200 })
}

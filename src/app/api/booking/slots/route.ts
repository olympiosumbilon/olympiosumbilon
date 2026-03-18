import { handleBookingSlotsGet } from '@/backend/controllers/bookingController'

export async function GET(request: Request) {
  return handleBookingSlotsGet(request)
}

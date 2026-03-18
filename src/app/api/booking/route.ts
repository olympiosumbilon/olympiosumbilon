import { handleBookingPost } from '@/backend/controllers/bookingController'

export async function POST(request: Request) {
  return handleBookingPost(request)
}

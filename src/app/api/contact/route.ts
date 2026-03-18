import { handleContactPost } from '@/backend/controllers/contactController'

export async function POST(request: Request) {
  return handleContactPost(request)
}

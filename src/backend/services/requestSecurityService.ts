import { CONTACT_FORM_LIMITS } from '@/backend/constants/contact'
import { verifyTurnstileToken } from '@/backend/infrastructure/security/turnstile'

export function getClientIpAddress(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  return request.headers.get('x-real-ip') || 'unknown'
}

export function isAllowedRequestOrigin(request: Request) {
  const origin = request.headers.get('origin')
  if (!origin) return true

  const requestHost = request.headers.get('host')
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL

  try {
    const originUrl = new URL(origin)
    if (requestHost && originUrl.host === requestHost) {
      return true
    }

    if (configuredSiteUrl) {
      return originUrl.host === new URL(configuredSiteUrl).host
    }
  } catch {
    return false
  }

  return false
}

export function createRateLimiter() {
  const requestStore = new Map<string, { count: number; resetAt: number }>()

  return function isRateLimited(ipAddress: string) {
    const currentTime = Date.now()
    const currentWindow = requestStore.get(ipAddress)

    if (!currentWindow || currentWindow.resetAt <= currentTime) {
      requestStore.set(ipAddress, {
        count: 1,
        resetAt: currentTime + CONTACT_FORM_LIMITS.rateLimitWindowMs,
      })
      return false
    }

    if (currentWindow.count >= CONTACT_FORM_LIMITS.rateLimitMaxRequests) {
      return true
    }

    currentWindow.count += 1
    requestStore.set(ipAddress, currentWindow)
    return false
  }
}

export async function validateTurnstileToken(token: string, ipAddress: string) {
  return verifyTurnstileToken(token, ipAddress)
}

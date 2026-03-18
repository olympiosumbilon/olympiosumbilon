import { NextResponse } from 'next/server'
import { CONTACT_FORM_LIMITS } from '@/backend/constants/contact'
import type { ContactPayload } from '@/backend/models/contact'
import { captureLeadFromWebsite } from '@/backend/services/leadService'
import {
  createRateLimiter,
  getClientIpAddress,
  isAllowedRequestOrigin,
  validateTurnstileToken,
} from '@/backend/services/requestSecurityService'
import {
  getContactPayloadError,
  normalizeContactPayload,
} from '@/backend/services/contactValidationService'

const isRateLimited = createRateLimiter()

async function parseContactPayload(request: Request) {
  const rawBody = await request.text()
  if (rawBody.length > CONTACT_FORM_LIMITS.maxBodySize) {
    return { payload: null, error: 'Request payload is too large.', status: 413 }
  }

  try {
    return {
      payload: JSON.parse(rawBody) as ContactPayload,
      error: null,
      status: 200,
    }
  } catch {
    return { payload: null, error: 'Invalid request payload.', status: 400 }
  }
}

function getRateLimitResponse(clientIpAddress: string) {
  if (!isRateLimited(clientIpAddress)) {
    return null
  }

  return NextResponse.json(
    { message: 'Too many submissions. Please wait a few minutes and try again.' },
    { status: 429 }
  )
}

async function getSecurityValidationResponse(request: Request, turnstileToken: string, clientIpAddress: string) {
  if (!isAllowedRequestOrigin(request)) {
    return NextResponse.json({ message: 'Invalid request origin.' }, { status: 403 })
  }

  const isTurnstileValid = await validateTurnstileToken(turnstileToken, clientIpAddress)
  if (!isTurnstileValid) {
    return NextResponse.json({ message: 'Security verification failed. Please try again.' }, { status: 400 })
  }

  return null
}

export async function handleContactPost(request: Request) {
  try {
    const clientIpAddress = getClientIpAddress(request)
    const rateLimitResponse = getRateLimitResponse(clientIpAddress)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    const parsedRequest = await parseContactPayload(request)
    if (!parsedRequest.payload) {
      return NextResponse.json({ message: parsedRequest.error }, { status: parsedRequest.status })
    }

    const normalizedPayload = normalizeContactPayload(parsedRequest.payload)
    const payloadError = getContactPayloadError(parsedRequest.payload, normalizedPayload)
    if (payloadError) {
      return NextResponse.json({ message: payloadError }, { status: 400 })
    }

    const securityValidationResponse = await getSecurityValidationResponse(
      request,
      normalizedPayload.turnstileToken,
      clientIpAddress
    )
    if (securityValidationResponse) {
      return securityValidationResponse
    }

    await captureLeadFromWebsite(normalizedPayload)

    return NextResponse.json({ message: 'Lead captured successfully.' }, { status: 200 })
  } catch (error) {
    console.error('Error processing lead submission:', error)
    return NextResponse.json(
      {
        message: 'Failed to capture lead. Check the database configuration and try again.',
      },
      { status: 500 }
    )
  }
}

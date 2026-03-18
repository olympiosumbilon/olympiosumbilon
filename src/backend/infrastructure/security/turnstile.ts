export async function verifyTurnstileToken(token: string, ipAddress: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    return true
  }

  if (!token) {
    return false
  }

  const formData = new URLSearchParams()
  formData.append('secret', secret)
  formData.append('response', token)

  if (ipAddress && ipAddress !== 'unknown') {
    formData.append('remoteip', ipAddress)
  }

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
    cache: 'no-store',
  })

  if (!response.ok) {
    return false
  }

  const result = (await response.json()) as { success?: boolean }
  return Boolean(result.success)
}

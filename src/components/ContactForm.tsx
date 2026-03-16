'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string
          callback?: (token: string) => void
          'expired-callback'?: () => void
          'error-callback'?: () => void
          theme?: 'light' | 'dark' | 'auto'
        }
      ) => string
      remove?: (widgetId: string) => void
      reset?: (widgetId: string) => void
    }
  }
}

const ContactForm = () => {
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    businessType: '',
    inquiriesPerWeek: '',
    challenge: '',
    website: '',
  })
  const [status, setStatus] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')
  const [turnstileReady, setTurnstileReady] = useState(false)
  const [submittedLead, setSubmittedLead] = useState<{ name: string; email: string } | null>(null)
  const [slotsStatus, setSlotsStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [slotsMessage, setSlotsMessage] = useState('')
  const [availableSlots, setAvailableSlots] = useState<
    Array<{ id: number; slot_date: string; start_time: string; end_time: string }>
  >([])
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null)
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [bookingMessage, setBookingMessage] = useState('')
  const turnstileContainerRef = useRef<HTMLDivElement | null>(null)
  const turnstileWidgetIdRef = useRef<string | null>(null)

  const groupedSlots = useMemo(() => {
    return availableSlots.reduce<Record<string, typeof availableSlots>>((groups, slot) => {
      if (!groups[slot.slot_date]) {
        groups[slot.slot_date] = []
      }

      groups[slot.slot_date].push(slot)
      return groups
    }, {})
  }, [availableSlots])

  useEffect(() => {
    if (!turnstileSiteKey || !turnstileReady || !turnstileContainerRef.current || !window.turnstile) {
      return
    }

    if (turnstileWidgetIdRef.current) {
      return
    }

    turnstileWidgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
      sitekey: turnstileSiteKey,
      theme: 'dark',
      callback: (token) => setTurnstileToken(token),
      'expired-callback': () => setTurnstileToken(''),
      'error-callback': () => setTurnstileToken(''),
    })

    return () => {
      if (turnstileWidgetIdRef.current && window.turnstile?.remove) {
        window.turnstile.remove(turnstileWidgetIdRef.current)
        turnstileWidgetIdRef.current = null
      }
    }
  }, [turnstileReady, turnstileSiteKey])

  useEffect(() => {
    if (status !== 'success' || !submittedLead) {
      return
    }

    let cancelled = false

    const loadSlots = async () => {
      setSlotsStatus('loading')
      setSlotsMessage('')

      try {
        const response = await fetch('/api/booking/slots')
        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load booking slots.')
        }

        if (cancelled) {
          return
        }

        const slots = Array.isArray(data.slots) ? data.slots : []
        setAvailableSlots(slots)
        setSelectedSlotId(slots[0]?.id ?? null)
        setSlotsStatus('ready')
        if (slots.length === 0) {
          setSlotsMessage('No open audit slots are available yet. Please message us and we will schedule you manually.')
        }
      } catch (error) {
        if (cancelled) {
          return
        }

        setAvailableSlots([])
        setSelectedSlotId(null)
        setSlotsStatus('error')
        setSlotsMessage('We could not load the booking slots right now. Please try again in a moment.')
      }
    }

    void loadSlots()

    return () => {
      cancelled = true
    }
  }, [status, submittedLead])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    setStatusMessage('')

    if (turnstileSiteKey && !turnstileToken) {
      setStatus('error')
      setStatusMessage('Please complete the security check before submitting.')
      return
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          businessType: formData.businessType,
          inquiriesPerWeek: formData.inquiriesPerWeek,
          challenge: formData.challenge,
          website: formData.website,
          turnstileToken,
          source: 'website-contact-form',
          message: `Business Type: ${formData.businessType || 'N/A'}\nInquiries Per Week: ${formData.inquiriesPerWeek || 'N/A'}\n\nBiggest Challenge:\n${formData.challenge}`,
        }),
      })

      if (response.ok) {
        const fullName = `${formData.firstName} ${formData.lastName}`.trim()
        setStatus('success')
        setStatusMessage('Your lead is in. Pick an available audit slot below.')
        setSubmittedLead({
          name: fullName,
          email: formData.email.trim().toLowerCase(),
        })
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          businessType: '',
          inquiriesPerWeek: '',
          challenge: '',
          website: '',
        })
        setTurnstileToken('')
        if (turnstileWidgetIdRef.current && window.turnstile?.reset) {
          window.turnstile.reset(turnstileWidgetIdRef.current)
        }
      } else {
        const data = await response.json().catch(() => ({}))
        setStatus('error')
        setStatusMessage(data.message || 'Failed to send message. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setStatusMessage('Network error while sending. Please try again.')
    }
  }

  const handleBookSlot = async () => {
    if (!submittedLead?.email || !selectedSlotId) {
      setBookingStatus('error')
      setBookingMessage('Please choose an available time slot first.')
      return
    }

    setBookingStatus('saving')
    setBookingMessage('')

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slotId: selectedSlotId,
          email: submittedLead.email,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.message || 'Failed to confirm booking.')
      }

      setBookingStatus('success')
      setBookingMessage('Booking confirmed. Redirecting...')
      window.location.assign('/thank-you')
    } catch (error) {
      setBookingStatus('error')
      setBookingMessage(error instanceof Error ? error.message : 'Failed to confirm booking.')
    }
  }

  const formatSlotDate = (value: string) =>
    new Date(`${value}T00:00:00`).toLocaleDateString('en-PH', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    })

  const formatSlotTime = (value: string) =>
    new Date(`1970-01-01T${value}`).toLocaleTimeString('en-PH', {
      hour: 'numeric',
      minute: '2-digit',
    })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {turnstileSiteKey ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onLoad={() => setTurnstileReady(true)}
        />
      ) : null}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400 mb-2">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="block w-full rounded-lg border border-slate-700 focus:border-[#c8ff57]/50 focus:outline-none text-slate-100 text-base py-3 px-4 bg-[#0b1220] transition-colors"
            placeholder="Maria"
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400 mb-2">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="block w-full rounded-lg border border-slate-700 focus:border-[#c8ff57]/50 focus:outline-none text-slate-100 text-base py-3 px-4 bg-[#0b1220] transition-colors"
            placeholder="Santos"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400 mb-2">
          Business Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="block w-full rounded-lg border border-slate-700 focus:border-[#c8ff57]/50 focus:outline-none text-slate-100 text-base py-3 px-4 bg-[#0b1220] transition-colors"
          placeholder="maria@yourbusiness.com"
        />
      </div>

      <div>
        <label htmlFor="businessType" className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400 mb-2">
          Business Type
        </label>
        <select
          name="businessType"
          id="businessType"
          value={formData.businessType}
          onChange={handleChange}
          required
          className="block w-full rounded-lg border border-slate-700 focus:border-[#c8ff57]/50 focus:outline-none text-slate-100 text-base py-3 px-4 bg-[#0b1220] transition-colors"
        >
          <option value="" className="bg-[#0b1220] text-slate-400">Select your industry...</option>
          <option value="Dental Clinic" className="bg-[#0b1220] text-slate-100">Dental Clinic</option>
          <option value="Beauty / Wellness Clinic" className="bg-[#0b1220] text-slate-100">Beauty / Wellness Clinic</option>
          <option value="Coaching / Consulting" className="bg-[#0b1220] text-slate-100">Coaching / Consulting</option>
          <option value="Other Service Business" className="bg-[#0b1220] text-slate-100">Other Service Business</option>
        </select>
      </div>

      <div>
        <label htmlFor="inquiriesPerWeek" className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400 mb-2">
          Inquiries Per Week?
        </label>
        <select
          name="inquiriesPerWeek"
          id="inquiriesPerWeek"
          value={formData.inquiriesPerWeek}
          onChange={handleChange}
          required
          className="block w-full rounded-lg border border-slate-700 focus:border-[#c8ff57]/50 focus:outline-none text-slate-100 text-base py-3 px-4 bg-[#0b1220] transition-colors"
        >
          <option value="" className="bg-[#0b1220] text-slate-400">Select a range...</option>
          <option value="Less than 10" className="bg-[#0b1220] text-slate-100">Less than 10</option>
          <option value="10-30" className="bg-[#0b1220] text-slate-100">10-30</option>
          <option value="30-60" className="bg-[#0b1220] text-slate-100">30-60</option>
          <option value="60+" className="bg-[#0b1220] text-slate-100">60+</option>
        </select>
      </div>

      <div>
        <label htmlFor="challenge" className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400 mb-2">
          Biggest Challenge Right Now
        </label>
        <textarea
          name="challenge"
          id="challenge"
          rows={4}
          value={formData.challenge}
          onChange={handleChange}
          required
          className="block w-full rounded-lg border border-slate-700 focus:border-[#c8ff57]/50 focus:outline-none text-slate-100 text-base py-3 px-4 bg-[#0b1220] transition-colors resize-none"
          placeholder="e.g. Leads go cold before we can follow up, or bookings are all manual..."
        />
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          type="text"
          name="website"
          id="website"
          tabIndex={-1}
          autoComplete="off"
          value={formData.website}
          onChange={handleChange}
        />
      </div>

      {turnstileSiteKey ? (
        <div className="space-y-2">
          <div ref={turnstileContainerRef} />
          <p className="text-xs text-slate-500">This security check helps block spam submissions.</p>
        </div>
      ) : null}

      {status !== 'success' && (
        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full bg-[#c8ff57] hover:bg-[#d4ff7a] text-[#070b15] font-extrabold py-3.5 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-[1.1rem] leading-tight whitespace-nowrap"
        >
          {status === 'sending' ? 'Sending...' : 'Book My Free Audit Call ->'}
        </button>
      )}

      <p className="text-center text-slate-500 text-sm">No spam. No sales pressure. Just clarity on your lead system.</p>

      {status === 'success' && (
        <div className="space-y-3">
          <p className="text-green-500 text-center font-medium">{statusMessage}</p>

          <div className="rounded-xl border border-slate-700 bg-[#0b1220] p-4 sm:p-5">
            <div className="mb-4">
              <p className="text-sm font-semibold text-slate-100">Choose Your Audit Slot</p>
              <p className="mt-1 text-sm text-slate-400">
                Booking for <span className="text-slate-200">{submittedLead?.name}</span> ({submittedLead?.email})
              </p>
            </div>

            {slotsStatus === 'loading' && <p className="text-sm text-slate-400">Loading available slots...</p>}

            {slotsStatus === 'error' && <p className="text-sm text-red-400">{slotsMessage}</p>}

            {slotsStatus === 'ready' && availableSlots.length > 0 && (
              <div className="space-y-4">
                {Object.entries(groupedSlots).map(([slotDate, slots]) => (
                  <div key={slotDate} className="rounded-lg border border-slate-700 bg-[#060b17] p-3">
                    <p className="mb-3 text-sm font-semibold text-slate-200">{formatSlotDate(slotDate)}</p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {slots.map((slot) => {
                        const isSelected = selectedSlotId === slot.id
                        return (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => setSelectedSlotId(slot.id)}
                            className={`rounded-lg border px-3 py-3 text-left text-sm transition-colors ${
                              isSelected
                                ? 'border-[#c8ff57] bg-[#c8ff57]/10 text-[#c8ff57]'
                                : 'border-slate-700 bg-[#0b1220] text-slate-300 hover:border-slate-500'
                            }`}
                          >
                            {formatSlotTime(slot.start_time)} - {formatSlotTime(slot.end_time)}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleBookSlot}
                  disabled={!selectedSlotId || bookingStatus === 'saving'}
                  className="w-full rounded-lg bg-[#c8ff57] px-6 py-3.5 text-base font-extrabold text-[#070b15] transition-all duration-300 hover:bg-[#d4ff7a] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {bookingStatus === 'saving' ? 'Confirming Booking...' : 'Confirm My Audit Slot'}
                </button>
              </div>
            )}

            {slotsStatus === 'ready' && availableSlots.length === 0 && (
              <p className="text-sm text-slate-400">{slotsMessage}</p>
            )}

            {bookingStatus === 'error' && <p className="mt-3 text-sm text-red-400">{bookingMessage}</p>}
          </div>
        </div>
      )}
      {status === 'error' && (
        <p className="text-red-500 text-center font-medium">{statusMessage}</p>
      )}
    </form>
  )
}

export default ContactForm

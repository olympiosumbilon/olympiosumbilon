'use client'
import React, { useState } from 'react'

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    businessType: '',
    inquiriesPerWeek: '',
    challenge: ''
  })
  const [status, setStatus] = useState('')
  const [statusMessage, setStatusMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    setStatusMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          message: `Business Type: ${formData.businessType || 'N/A'}\nInquiries Per Week: ${formData.inquiriesPerWeek || 'N/A'}\n\nBiggest Challenge:\n${formData.challenge}`,
        }),
      })

      if (response.ok) {
        setStatus('success')
        setStatusMessage('Message sent successfully!')
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          businessType: '',
          inquiriesPerWeek: '',
          challenge: ''
        })
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full bg-[#c8ff57] hover:bg-[#d4ff7a] text-[#070b15] font-extrabold py-3.5 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-[1.1rem]"
      >
        {status === 'sending' ? 'Sending...' : 'Book My Free Audit Call ->'}
      </button>

      <p className="text-center text-slate-500 text-sm">🔒 No spam. No sales pressure. Just clarity on your lead system.</p>

      {status === 'success' && (
        <p className="text-green-500 text-center font-medium">{statusMessage}</p>
      )}
      {status === 'error' && (
        <p className="text-red-500 text-center font-medium">{statusMessage}</p>
      )}
    </form>
  )
}

export default ContactForm

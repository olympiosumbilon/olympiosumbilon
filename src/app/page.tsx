'use client'
import React, { useEffect, useMemo, useRef } from 'react'
import Header from '@/components/Header'
import ContactForm from '@/components/ContactForm'
import SocialLinks from '@/components/SocialLinks'
import FloatingContact from '@/components/FloatingContact'
import ScrollToTop from '@/components/ScrollToTop'
import content from '@/data/content.json'
import Image from 'next/image'

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let frame = 0

    type Dot = { x: number; y: number; vx: number; vy: number; r: number }
    let dots: Dot[] = []

    const reset = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      dots = Array.from({ length: 56 }).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.4,
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      for (let i = 0; i < dots.length; i += 1) {
        for (let j = i + 1; j < dots.length; j += 1) {
          const dx = dots[i].x - dots[j].x
          const dy = dots[i].y - dots[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 140) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(245, 158, 11, ${0.08 * (1 - dist / 140)})`
            ctx.lineWidth = 0.6
            ctx.moveTo(dots[i].x, dots[i].y)
            ctx.lineTo(dots[j].x, dots[j].y)
            ctx.stroke()
          }
        }
      }

      dots.forEach((dot) => {
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(250, 204, 21, 0.25)'
        ctx.fill()

        dot.x += dot.vx
        dot.y += dot.vy
        if (dot.x < 0 || dot.x > width) dot.vx *= -1
        if (dot.y < 0 || dot.y > height) dot.vy *= -1
      })

      frame = window.requestAnimationFrame(draw)
    }

    reset()
    draw()
    window.addEventListener('resize', reset)

    return () => {
      window.removeEventListener('resize', reset)
      window.cancelAnimationFrame(frame)
    }
  }, [])

  const tickerItems = useMemo(
    () => [
      ...content.idealClients.industries,
      ...content.solution.features,
      '24/7 Lead Conversion',
      'Automated Booking',
    ],
    []
  )

  return (
    <main className="min-h-screen bg-[#060b17] text-slate-100">
      <canvas ref={canvasRef} className="bf-canvas" aria-hidden="true" />
      <Header />

      <section className="relative z-10 min-h-screen flex items-center pt-28 pb-16 px-5 md:px-8">
        <div className="mx-auto w-full max-w-[1180px]">
          <div className="inline-flex items-center gap-2 border border-slate-700 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-slate-300 mb-10">
            <span className="w-2 h-2 rounded-full bg-[#c8ff57] animate-pulse" />
            {content.hero.tagline}
          </div>

          <h1 className="font-extrabold leading-[0.95] tracking-[-0.03em] text-[clamp(2.6rem,7vw,6.2rem)] max-w-5xl mb-8">
            {content.hero.title.includes('Leads -') ? (
              <>
                {content.hero.title.split('Leads -')[0]}
                <span className="text-[#c8ff57]">Leads -</span>
                {content.hero.title.split('Leads -')[1]}
              </>
            ) : (
              content.hero.title
            )}
          </h1>

          <p className="max-w-2xl text-slate-300 text-[clamp(1rem,1.5vw,1.08rem)] leading-relaxed mb-10">
            {content.hero.subtitle}
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            <a href={content.hero.ctaButton.href} className="bf-btn-main">
              {content.hero.ctaButton.text}
            </a>
            <a href={content.hero.secondaryButton.href} className="bf-btn-line">
              {content.hero.secondaryButton.text}
            </a>
          </div>

          <div className="grid sm:grid-cols-3 max-w-[560px] border border-slate-700 rounded-xl overflow-hidden bg-[#0a1222]/80 backdrop-blur-sm">
            {content.hero.bullets.map((bullet, index) => (
              <div key={index} className="px-4 py-5 border-b sm:border-b-0 sm:border-r last:border-r-0 border-slate-700 text-center">
                <div className="font-bold text-[#c8ff57] text-xl mb-1">0{index + 1}</div>
                <div className="text-[12px] uppercase tracking-[0.08em] text-slate-300">{bullet}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="relative z-10 border-y border-slate-800 bg-[#0b1220] overflow-hidden">
        <div className="bf-ticker-track py-4">
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <span key={index} className="inline-flex items-center gap-4 px-8 text-xs uppercase tracking-[0.08em] text-slate-300 whitespace-nowrap">
              <span className="text-[#c8ff57] text-[10px]">●</span>
              {item}
            </span>
          ))}
        </div>
      </div>

      <section className="relative z-10 px-5 md:px-8 py-24 bg-[#090f1d]">
        <div className="mx-auto max-w-[1180px]">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 mb-14 items-end">
            <div>
              <p className="bf-label">The Problem</p>
              <h2 className="bf-title">{content.problem.title}</h2>
            </div>
            <div>
              <p className="text-slate-300 mb-4">{content.problem.subtitle}</p>
              <p className="border-l-2 border-[#c8ff57] pl-4 text-sm text-slate-400 leading-relaxed">{content.problem.cta}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-slate-800 border border-slate-800 rounded-xl overflow-hidden">
            {content.problem.items.map((item, index) => (
              <article key={index} className="bg-[#060b17] p-8 md:p-10 hover:bg-[#0b1220] transition-colors">
                <p className="text-[11px] tracking-[0.18em] uppercase text-slate-500 mb-5">0{index + 1} / 04</p>
                <h3 className="font-bold text-xl mb-3">{item.title}</h3>
                <p className="text-slate-300 leading-relaxed">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="case-studies" className="relative z-10 px-5 md:px-8 py-24 bg-[#060b17]">
        <div className="mx-auto max-w-[1180px]">
          <p className="bf-label">Case Studies</p>
          <h2 className="bf-title">{content.caseStudies.title}</h2>
          <p className="bf-sub">How the system translates into better conversion outcomes.</p>

          <div className="grid lg:grid-cols-2 gap-6 mt-12">
            {content.caseStudies.items.map((study, index) => (
              <article key={index} className="bg-[#0a1222] border border-slate-700 rounded-xl p-8 hover:border-[#c8ff57]/40 transition-colors">
                <div className="inline-flex px-3 py-1 rounded border border-[#c8ff57]/30 bg-[#c8ff57]/10 text-[#c8ff57] text-[11px] uppercase tracking-[0.14em] font-semibold mb-4">
                  Case {index + 1}
                </div>
                <h3 className="text-2xl font-bold mb-3">{study.name}</h3>
                <p className="text-slate-400 text-sm mb-5">{study.problem}</p>

                <div className="grid grid-cols-3 gap-3 py-4 border-y border-slate-700 mb-5">
                  <div>
                    <div className="text-2xl font-extrabold text-[#c8ff57]">{study.solution.length}</div>
                    <div className="text-[11px] text-slate-400 uppercase tracking-[0.08em]">Stack Parts</div>
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-[#c8ff57]">24/7</div>
                    <div className="text-[11px] text-slate-400 uppercase tracking-[0.08em]">Automation</div>
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-[#c8ff57]">ROI</div>
                    <div className="text-[11px] text-slate-400 uppercase tracking-[0.08em]">Focus</div>
                  </div>
                </div>

                <ul className="space-y-2 mb-5">
                  {study.solution.map((line, lineIndex) => (
                    <li key={lineIndex} className="text-slate-300 text-sm"><span className="text-[#c8ff57]">-</span> {line}</li>
                  ))}
                </ul>

                <p className="text-slate-200 italic">{study.outcome}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="solutions" className="relative z-10 px-5 md:px-8 py-24 bg-[#090f1d]">
        <div className="mx-auto max-w-[1180px] grid lg:grid-cols-[0.9fr_2fr] gap-10 lg:gap-16">
          <aside className="lg:sticky lg:top-24 h-fit">
            <p className="bf-label">Solutions</p>
            <h2 className="bf-title">{content.solution.title}</h2>
            <p className="bf-sub">{content.solution.subtitle}</p>
            <div className="mt-8 p-5 rounded-xl border border-slate-700 bg-[#0b1220] text-sm text-slate-300 leading-relaxed">
              All systems are built for your workflow: capture, qualify, follow up, and booking automation.
            </div>
          </aside>

          <div className="relative border border-slate-800 rounded-xl overflow-hidden bg-slate-800/80">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-[#090f1d] to-transparent z-10 hidden lg:block"></div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#090f1d] to-transparent z-10 hidden lg:block"></div>
            <div className="lg:max-h-[760px] lg:overflow-y-auto scrollbar-hide lg:scroll-smooth lg:snap-y lg:snap-mandatory">
            {content.services.items.map((service, index) => (
              <article
                key={index}
                className={`bg-[#060b17] p-8 md:p-9 border-b border-slate-800 last:border-b-0 lg:snap-start transition-all duration-300 hover:bg-[#0a1324] ${index === 0 ? 'border-l-2 border-l-[#c8ff57]' : ''}`}
              >
                <div className="inline-flex px-3 py-1 rounded border border-[#c8ff57]/25 bg-[#c8ff57]/10 text-[#c8ff57] text-[11px] uppercase tracking-[0.14em] font-semibold mb-4">
                  {index === 0 ? 'Featured' : 'System'}
                </div>
                <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                <p className="text-slate-300 mb-4 leading-relaxed">{service.description}</p>
                <ul className="space-y-2 mb-4">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="text-sm text-slate-300"><span className="text-[#c8ff57]">-</span> {feature}</li>
                  ))}
                </ul>
                <p className="text-sm text-slate-400">Outcome: <span className="text-[#c8ff57] font-semibold">{service.outcome}</span></p>
              </article>
            ))}
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="relative z-10 px-5 md:px-8 py-24 bg-[#060b17]">
        <div className="mx-auto max-w-[1180px]">
          <p className="bf-label">Process</p>
          <h2 className="bf-title">{content.howItWorks.title}</h2>
          <p className="bf-sub">{content.howItWorks.subtitle}</p>

          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-800 border border-slate-800 rounded-xl overflow-hidden">
            {content.howItWorks.steps.map((step, index) => (
              <article key={index} className="bg-[#060b17] p-8">
                <div className="text-5xl font-extrabold text-[#c8ff57]/15 leading-none mb-5">0{index + 1}</div>
                <h3 className="font-bold text-xl mb-2">{step.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-5 md:px-8 py-24 bg-[#090f1d] border-y border-slate-800 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(200,255,87,0.08)_0%,transparent_70%)]" />
        <div className="mx-auto max-w-[1180px] text-center relative">
          <h2 className="font-extrabold tracking-[-0.03em] leading-[0.95] text-[clamp(2.1rem,5.2vw,5.2rem)] mb-6">
            Your Competitors Are
            <br />
            Booking While You Sleep.
          </h2>
          <p className="text-slate-300 text-[clamp(1rem,1.5vw,1.15rem)] mb-10">
            Find out where your leads are leaking - free, no obligation.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="#contact" className="bf-btn-main">
              Get Free Audit Call {'->'}
            </a>
            <a href="#case-studies" className="bf-btn-line">
              See Client Results
            </a>
          </div>
        </div>
      </section>

      <section id="resources" className="relative z-10 px-5 md:px-8 py-24 bg-[#090f1d]">
        <div className="mx-auto max-w-[1180px]">
          <p className="bf-label">Resources</p>
          <h2 className="bf-title">{content.blog.title}</h2>
          <p className="bf-sub">{content.blog.subtitle}</p>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[...content.blog.posts].slice(0, 3).map((post, index) => (
              <a key={index} href={`/blog/${post.slug}`} className="group block rounded-xl overflow-hidden border border-slate-700 bg-[#060b17] hover:border-[#c8ff57]/40 transition-colors">
                <div className="relative aspect-[16/10]">
                  <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-[#c8ff57] mb-2">{post.category}</p>
                  <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                  <p className="text-sm text-slate-300">{post.excerpt}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="relative z-10 px-5 md:px-8 py-24 bg-[#060b17]">
        <div className="mx-auto max-w-[1180px] border border-slate-700 rounded-2xl overflow-hidden bg-[#070d1a]">
          <div className="grid lg:grid-cols-[0.85fr_1.4fr]">
            <div className="relative min-h-[540px] border-r border-slate-700 bg-[linear-gradient(0deg,rgba(30,41,59,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.35)_1px,transparent_1px)] bg-[size:26px_26px]">
              <Image src={content.founder.image} alt="Olympio - Founder of Pyow Digitals" fill className="object-cover opacity-75" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060b17] via-[#060b17]/20 to-transparent"></div>
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-[0.1em] border border-[#c8ff57]/35 bg-[#c8ff57]/10 text-[#c8ff57]">Founder</span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-[#0b1220]/90 border border-slate-700 rounded-xl p-4">
                <p className="text-sm font-semibold text-slate-100">Olympio Sumbilon Jr</p>
                <p className="text-xs text-[#c8ff57]">Founder & Lead Developer</p>
              </div>
            </div>

            <div className="p-7 md:p-10 lg:p-12">
              <p className="bf-label">About</p>
              <h2 className="font-extrabold tracking-[-0.03em] leading-[0.92] text-[clamp(2rem,4.5vw,3.8rem)] mb-3">
                Built by a developer
                <br />
                who actually <span className="text-[#c8ff57]">gets business</span>
              </h2>
              <p className="text-slate-400 mb-7 text-[0.95rem]">Not just code - systems that close clients.</p>

              <p className="text-slate-300 leading-relaxed mb-4">{content.founder.description}</p>
              <p className="text-slate-300 leading-relaxed mb-8">{content.founder.story}</p>

              <div className="grid sm:grid-cols-2 gap-3 mb-8">
                <div className="border border-slate-700 rounded-lg px-4 py-3 bg-[#0b1220]">
                  <p className="text-sm font-semibold text-slate-100">⚡ Full-Stack Developer</p>
                  <p className="text-xs text-slate-400 mt-1">Next.js, React, modern web stack</p>
                </div>
                <div className="border border-slate-700 rounded-lg px-4 py-3 bg-[#0b1220]">
                  <p className="text-sm font-semibold text-slate-100">🤖 Automation Specialist</p>
                  <p className="text-xs text-slate-400 mt-1">CRM, email, messenger flows</p>
                </div>
                <div className="border border-slate-700 rounded-lg px-4 py-3 bg-[#0b1220]">
                  <p className="text-sm font-semibold text-slate-100">📈 Conversion-Focused</p>
                  <p className="text-xs text-slate-400 mt-1">Every build tied to a business outcome</p>
                </div>
                <div className="border border-slate-700 rounded-lg px-4 py-3 bg-[#0b1220]">
                  <p className="text-sm font-semibold text-slate-100">📍 Based in Davao, PH</p>
                  <p className="text-xs text-slate-400 mt-1">Serving PH service businesses</p>
                </div>
              </div>

              <div className="border-l-2 border-[#c8ff57] bg-[#0b1220]/80 rounded-r-lg px-4 py-4 mb-8">
                <p className="text-sm italic text-slate-200 mb-2">
                  &quot;Most businesses don&apos;t need more leads. They need a system that actually converts the ones they&apos;re already getting.&quot;
                </p>
                <p className="text-sm font-semibold text-[#c8ff57]">- Olympio, Founder of Pyow Digitals</p>
              </div>

              <div className="flex flex-wrap items-center gap-3 mb-8">
                <a href="#contact" className="bf-btn-main">Work With Olympio {'->'}</a>
                <a
                  href="https://www.instagram.com/olympiosumbilonjr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 inline-flex items-center justify-center rounded-md border border-slate-700 bg-[#0b1220] text-slate-300 hover:text-[#c8ff57] hover:border-[#c8ff57]/40 transition-colors shrink-0"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5Zm8.9 1.35a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Z" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/olympiosumbilonjr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-9 h-9 inline-flex items-center justify-center rounded-md border border-slate-700 bg-[#0b1220] text-slate-300 hover:text-[#c8ff57] hover:border-[#c8ff57]/40 transition-colors shrink-0"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.45 20.45H16.9v-5.57c0-1.32-.03-3.03-1.85-3.03-1.85 0-2.14 1.44-2.14 2.93v5.67H9.35V9h3.42v1.56h.04c.48-.9 1.64-1.85 3.37-1.85 3.61 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43A2.06 2.06 0 1 1 5.34 3.3a2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/olympiosumbilonjr"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 inline-flex items-center justify-center rounded-md border border-slate-700 bg-[#0b1220] text-slate-300 hover:text-[#c8ff57] hover:border-[#c8ff57]/40 transition-colors shrink-0"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 320 512">
                    <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06H297V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                  </svg>
                </a>
              </div>

              <div className="grid grid-cols-3 border-t border-slate-800 pt-5">
                <div className="text-center border-r border-slate-800">
                  <p className="text-3xl font-extrabold text-[#c8ff57] leading-none">15+</p>
                  <p className="text-[11px] uppercase tracking-[0.08em] text-slate-500 mt-2">Systems Built</p>
                </div>
                <div className="text-center border-r border-slate-800">
                  <p className="text-3xl font-extrabold text-[#c8ff57] leading-none">3x</p>
                  <p className="text-[11px] uppercase tracking-[0.08em] text-slate-500 mt-2">Avg Booking Lift</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-extrabold text-[#c8ff57] leading-none">48h</p>
                  <p className="text-[11px] uppercase tracking-[0.08em] text-slate-500 mt-2">Avg Setup Time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="relative z-10 px-5 md:px-8 py-24 bg-[#090f1d] border-t border-slate-800">
        <div className="mx-auto max-w-[1180px] grid lg:grid-cols-[1fr_1.1fr] gap-12">
          <div>
            <p className="bf-label">Free Consultation</p>
            <h2 className="font-extrabold tracking-[-0.03em] leading-[0.9] text-[clamp(2.2rem,5.2vw,5rem)] max-w-[620px] mb-6">
              Find Out Where Your Leads Are Leaking
            </h2>
            <p className="text-slate-300 mb-10 leading-relaxed max-w-[620px] text-[clamp(1rem,1.4vw,1.1rem)]">
              Book a free 30-minute audit call. We&apos;ll review your current inquiry flow and show you exactly where leads are dropping off - no pitch, just clarity.
            </p>
            <div className="space-y-4">
              {[
                {
                  icon: '🔎',
                  title: 'Lead Conversion Audit',
                  desc: 'We map where inquiries go cold in your current setup',
                },
                {
                  icon: '⚡',
                  title: 'Automation Recommendations',
                  desc: 'Specific tools and flows for your business type',
                },
                {
                  icon: '📋',
                  title: 'Funnel Improvement Plan',
                  desc: 'A clear roadmap you can implement with or without us',
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <span className="w-10 h-10 rounded-lg border border-[#c8ff57]/30 bg-[#c8ff57]/10 text-[#c8ff57] flex items-center justify-center text-sm flex-shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-slate-100 font-semibold text-[1.05rem] mb-1">{item.title}</p>
                    <p className="text-slate-400 text-[1.02rem] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#060b17] border border-slate-700 rounded-2xl p-7 md:p-9">
            <h3 className="text-xl font-bold mb-6">Book Your Free Audit</h3>
            <ContactForm />
          </div>
        </div>
      </section>

      <footer className="relative z-10 bg-[#060b17] border-t border-slate-800 px-5 md:px-8 pt-16 pb-8">
        <div className="mx-auto max-w-[1180px]">
          <div className="grid md:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="mb-4">
                <span className="font-bold text-xl text-white">PYOW</span>
                <span className="block text-sm font-semibold tracking-wider text-[#c8ff57]">DIGITALS</span>
              </div>
              <p className="text-slate-400 text-sm max-w-sm mb-6">{content.footer.description}</p>
              <SocialLinks />
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-[0.14em] text-slate-500 mb-4 font-semibold">Navigation</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><a href="#" className="hover:text-white">Home</a></li>
                <li><a href="#solutions" className="hover:text-white">Solutions</a></li>
                <li><a href="#case-studies" className="hover:text-white">Case Studies</a></li>
                <li><a href="#how-it-works" className="hover:text-white">How It Works</a></li>
                <li><a href="#contact" className="hover:text-white">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-[0.14em] text-slate-500 mb-4 font-semibold">Connect</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><a href="mailto:olympiosumbilonpersonal@gmail.com" className="hover:text-white">Email</a></li>
                <li><a href="https://www.linkedin.com/in/olympiosumbilonjr/" target="_blank" rel="noopener noreferrer" className="hover:text-white">LinkedIn</a></li>
                <li><a href="https://www.facebook.com/olympiosumbilonjr" target="_blank" rel="noopener noreferrer" className="hover:text-white">Facebook</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between gap-3 text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} Pyow Digitals. All rights reserved.</p>
            <div className="flex gap-5">
              {content.footer.links.map((link, index) => (
                <a key={index} href={link.href} className="hover:text-slate-300">{link.name}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <FloatingContact />
      <ScrollToTop />
    </main>
  )
}

import Link from 'next/link'

export default function ThankYouPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#060b17] text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(200,255,87,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(200,255,87,0.04)_1px,transparent_1px)] bg-[size:58px_58px]" />
        <div className="absolute -left-24 -top-24 h-[26rem] w-[26rem] rounded-full bg-[#c8ff57]/15 blur-[110px]" />
        <div className="absolute -right-24 -bottom-24 h-[22rem] w-[22rem] rounded-full bg-cyan-400/10 blur-[110px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-5 py-24 md:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-[#0a1222]/80 px-4 py-2 text-xs uppercase tracking-[0.1em] text-slate-300 transition-colors hover:border-[#c8ff57]/45 hover:text-[#c8ff57]"
          >
            <span aria-hidden="true">&larr;</span>
            Back to Home
          </Link>
          <Link href="/" className="text-sm font-extrabold tracking-[0.08em] text-slate-200">
            PYOW<span className="text-[#c8ff57]">DIGITALS</span>
          </Link>
        </div>

        <section className="rounded-2xl border border-slate-700 bg-[#0b1220]/90 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] md:p-10">
          <div className="mb-7 inline-flex h-16 w-16 items-center justify-center rounded-full border border-[#c8ff57]/45 bg-[#c8ff57]/15 text-3xl text-[#c8ff57]">
            <span aria-hidden="true">&#10003;</span>
          </div>

          <div className="mb-8 space-y-4">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#c8ff57]/30 bg-[#c8ff57]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#c8ff57]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c8ff57]" />
              Booking Confirmed
            </p>
            <h1 className="text-[clamp(2rem,4.5vw,3.4rem)] font-extrabold leading-[0.95] tracking-[-0.02em]">
              You&apos;re all set.
              <br />
              <span className="text-[#c8ff57]">Your audit request is in.</span>
            </h1>
            <p className="max-w-2xl text-slate-300">
              We&apos;ll review your details and connect with you for your free audit call. You can also send a quick message now if you want to share context before the call.
            </p>
          </div>

          <div className="grid gap-4 border-y border-slate-700 py-6 md:grid-cols-3">
            <article className="rounded-xl border border-slate-700 bg-[#060b17] p-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#c8ff57]">Step 01</p>
              <h2 className="mb-1 text-sm font-bold text-slate-100">Request Received</h2>
              <p className="text-xs leading-relaxed text-slate-400">Your details were sent successfully.</p>
            </article>
            <article className="rounded-xl border border-slate-700 bg-[#060b17] p-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#c8ff57]">Step 02</p>
              <h2 className="mb-1 text-sm font-bold text-slate-100">Business Review</h2>
              <p className="text-xs leading-relaxed text-slate-400">We check your current lead and follow-up flow.</p>
            </article>
            <article className="rounded-xl border border-slate-700 bg-[#060b17] p-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#c8ff57]">Step 03</p>
              <h2 className="mb-1 text-sm font-bold text-slate-100">Audit Call</h2>
              <p className="text-xs leading-relaxed text-slate-400">Clear action plan, no pressure and no fluff.</p>
            </article>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href="https://wa.me/639357258656"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[3rem] items-center justify-center rounded-lg border border-[#c8ff57]/60 bg-[#c8ff57] px-5 text-sm font-extrabold uppercase tracking-[0.06em] text-[#070b15] transition hover:bg-[#d4ff7a]"
            >
              Message on WhatsApp
            </a>
            <Link
              href="/blog"
              className="inline-flex min-h-[3rem] items-center justify-center rounded-lg border border-slate-600 bg-[#0a1222] px-5 text-sm font-semibold uppercase tracking-[0.06em] text-slate-200 transition hover:border-slate-400 hover:text-white"
            >
              Read Blog While Waiting
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}

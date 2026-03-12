import Link from 'next/link'
import { ReactNode } from 'react'

const navItems = [
  { href: '/crm-dashboard', label: 'Overview' },
  { href: '/crm-dashboard/leads', label: 'Leads' },
  { href: '/crm-dashboard/pipeline', label: 'Pipeline' },
] as const

export function CrmShell({
  title,
  eyebrow,
  description,
  children,
}: {
  title: string
  eyebrow: string
  description: string
  children: ReactNode
}) {
  return (
    <main className="min-h-screen bg-[#06111f] text-slate-100">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(163,230,53,0.13),transparent_24%),linear-gradient(180deg,#07111d_0%,#020816_100%)]" />

      <section className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6 lg:flex-row lg:items-end lg:justify-between lg:px-10">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-300/80">
              {eyebrow}
            </p>
            <h1 className="text-3xl font-black tracking-[-0.04em] sm:text-4xl">{title}</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">{description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/10"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/"
              className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-100 transition-colors hover:bg-cyan-400/20"
            >
              Back to Site
            </Link>
          </div>
        </div>
      </section>

      {children}
    </main>
  )
}

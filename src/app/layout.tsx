import type { Metadata } from 'next'
import { Manrope, Space_Grotesk } from 'next/font/google'
import './globals.css'
import Script from 'next/script'
import { absoluteUrl, siteConfig } from '@/lib/seo'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: 'Pyow Digitals | Stop Losing Leads with Automated Funnels',
    template: '%s',
  },
  description: siteConfig.description,
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  alternates: {
    canonical: absoluteUrl('/'),
  },
  openGraph: {
    siteName: siteConfig.name,
    locale: 'en_US',
    type: 'website',
    url: absoluteUrl('/'),
    title: 'Pyow Digitals | Stop Losing Leads with Automated Funnels',
    description: siteConfig.description,
    images: [{ url: absoluteUrl(siteConfig.ogImage), alt: siteConfig.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pyow Digitals | Stop Losing Leads with Automated Funnels',
    description: siteConfig.description,
    images: [absoluteUrl(siteConfig.ogImage)],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </head>
      <body className={`${manrope.variable} ${spaceGrotesk.variable}`}>{children}</body>
    </html>
  )
}

import Script from 'next/script'
import HomePageClient from '@/components/HomePageClient'
import { getBusinessSchema, getHomeMetadata } from '@/lib/seo'

export const metadata = getHomeMetadata()

export default function Home() {
  return (
    <>
      <Script
        id="business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getBusinessSchema()) }}
      />
      <HomePageClient />
    </>
  )
}

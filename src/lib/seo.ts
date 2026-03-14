import type { Metadata } from 'next'
import content from '@/data/content.json'

export const siteConfig = {
  name: 'Pyow Digitals',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://pyowdigitals.com',
  description:
    'Turn social media inquiries into booked clients with conversion funnels, websites, and marketing automation built for service businesses.',
  ogImage: '/images/logo.png',
  email: 'olympiosumbilonpersonal@gmail.com',
  phone: '+63 935 725 8656',
  sameAs: [
    'https://www.instagram.com/olympiosumbilonjr/',
    'https://www.linkedin.com/in/olympiosumbilonjr/',
    'https://www.facebook.com/olympiosumbilonjr',
  ],
} as const

export function absoluteUrl(path = '/') {
  return new URL(path, siteConfig.siteUrl).toString()
}

type MetadataInput = {
  title: string
  description: string
  path?: string
  image?: string
  type?: 'website' | 'article'
  publishedTime?: string
  keywords?: string[]
}

export function createMetadata({
  title,
  description,
  path = '/',
  image = siteConfig.ogImage,
  type = 'website',
  publishedTime,
  keywords = [],
}: MetadataInput): Metadata {
  const url = absoluteUrl(path)
  const imageUrl = absoluteUrl(image)

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type,
      images: [{ url: imageUrl, alt: title }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}

export const getHomeMetadata = () =>
  createMetadata({
    title: 'Pyow Digitals | Stop Losing Leads with Automated Funnels',
    description: siteConfig.description,
    path: '/',
    keywords: [
      'automated client acquisition systems',
      'marketing automation',
      'lead conversion funnels',
      'CRM automation',
      'service business website funnels',
    ],
  })

export const getBlogListMetadata = () =>
  createMetadata({
    title: 'Pyow Digitals Blog | Lead Conversion and Automation Insights',
    description: content.blog.subtitle,
    path: '/blog',
    keywords: [
      'lead conversion blog',
      'marketing automation articles',
      'CRM blog',
      'funnel strategy articles',
    ],
  })

export function getBlogPostBySlug(slug: string) {
  return content.blog.posts.find((post) => post.slug === slug)
}

export function getBlogPostMetadata(slug: string) {
  const post = getBlogPostBySlug(slug)
  if (!post) return null

  return createMetadata({
    title: `${post.title} | Pyow Digitals Blog`,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.image || siteConfig.ogImage,
    type: 'article',
    publishedTime: post.date,
    keywords: [post.category, 'Pyow Digitals blog', 'lead conversion'],
  })
}

export function getBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: siteConfig.name,
    url: siteConfig.siteUrl,
    image: absoluteUrl(siteConfig.ogImage),
    description: siteConfig.description,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    areaServed: 'Philippines',
    founder: {
      '@type': 'Person',
      name: 'Olympio Sumbilon Jr',
    },
    sameAs: [...siteConfig.sameAs],
    knowsAbout: [...content.solution.features],
  }
}

export function getBlogPostingSchema(slug: string) {
  const post = getBlogPostBySlug(slug)
  if (!post) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: absoluteUrl(post.image || siteConfig.ogImage),
    datePublished: post.date,
    dateModified: post.date,
    articleSection: post.category,
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    author: {
      '@type': 'Person',
      name: 'Olympio Sumbilon Jr',
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/images/logo.png'),
      },
    },
  }
}

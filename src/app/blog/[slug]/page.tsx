import type { Metadata } from 'next'
import Script from 'next/script'
import { notFound } from 'next/navigation'
import BlogPostPageClient from '@/components/BlogPostPageClient'
import content from '@/data/content.json'
import { getBlogPostBySlug, getBlogPostMetadata, getBlogPostingSchema } from '@/lib/seo'

type BlogPostPageProps = {
  params: {
    slug: string
  }
}

export function generateStaticParams() {
  return content.blog.posts.map((post) => ({
    slug: post.slug,
  }))
}

export function generateMetadata({ params }: BlogPostPageProps): Metadata {
  return getBlogPostMetadata(params.slug) || {}
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  if (!getBlogPostBySlug(params.slug)) {
    notFound()
  }

  const schema = getBlogPostingSchema(params.slug)

  return (
    <>
      {schema ? (
        <Script
          id={`blog-posting-schema-${params.slug}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ) : null}
      <BlogPostPageClient slug={params.slug} />
    </>
  )
}

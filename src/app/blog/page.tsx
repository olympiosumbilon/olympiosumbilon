import BlogPageClient from '@/components/BlogPageClient'
import { getBlogListMetadata } from '@/lib/seo'

export const metadata = getBlogListMetadata()

export default function BlogPage() {
  return <BlogPageClient />
}

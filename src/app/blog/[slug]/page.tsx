'use client'
import React from 'react'
import Header from '@/components/Header'
import content from '@/data/content.json'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string

  const post = content.blog.posts.find((p) => p.slug === slug)

  if (!post) {
    return (
      <main className="min-h-screen bg-[#060b17] text-slate-100">
        <Header />
        <div className="pt-32 pb-20 text-center px-5">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <Link href="/blog" className="bf-btn-line inline-flex">Back to Blog</Link>
        </div>
      </main>
    )
  }

  const renderContent = (text: string) => {
    const lines = text.split('\n')
    return lines.map((line, index) => {
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-bold text-slate-100 mt-10 mb-4">{line.replace('## ', '')}</h2>
      }

      if (line.startsWith('- ')) {
        return (
          <li key={index} className="text-slate-300 mb-2 leading-relaxed">
            <span className="text-[#c8ff57] mr-2">-</span>
            {line.replace('- ', '')}
          </li>
        )
      }

      if (line.trim() === '') {
        return <div key={index} className="h-3" />
      }

      return <p key={index} className="text-slate-300 mb-4 leading-relaxed">{line}</p>
    })
  }

  return (
    <main className="min-h-screen bg-[#060b17] text-slate-100">
      <Header />

      <section className="relative z-10 pt-32 pb-14 px-5 md:px-8 border-b border-slate-800 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(200,255,87,0.08),transparent_34%)]" />
        <div className="mx-auto max-w-[980px] relative">
          <Link href="/blog" className="inline-flex items-center text-slate-300 hover:text-[#c8ff57] mb-6 transition-colors">
            <span className="mr-2">{'<'}</span>
            Back to Blog
          </Link>

          <div className="flex items-center gap-4 mb-5">
            <span className="px-3 py-1 rounded border border-[#c8ff57]/30 bg-[#c8ff57]/10 text-[#c8ff57] text-[11px] uppercase tracking-[0.12em] font-semibold">{post.category}</span>
            <span className="text-sm text-slate-500">{post.date}</span>
          </div>

          <h1 className="text-[clamp(2.2rem,5vw,4rem)] font-extrabold tracking-[-0.03em] leading-[1.03]">
            {post.title}
          </h1>
        </div>
      </section>

      <section className="relative z-10 py-14 px-5 md:px-8">
        <div className="mx-auto max-w-[980px]">
          <div className="relative h-64 md:h-[430px] rounded-2xl overflow-hidden mb-12 border border-slate-700 bg-[#0b1220]">
            {post.image ? (
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 980px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-500">No image</div>
            )}
          </div>

          <article className="rounded-2xl border border-slate-700 bg-[#090f1d] p-6 md:p-10">
            {renderContent(post.content)}
          </article>

          <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between gap-5 items-center">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#0f172a] border border-slate-700 flex items-center justify-center text-[#c8ff57] font-bold">P</div>
              <div>
                <p className="font-semibold text-slate-100">Pyow Digitals</p>
                <p className="text-sm text-slate-400">Automated Client Acquisition Systems</p>
              </div>
            </div>
            <Link href="/#contact" className="bf-btn-main inline-flex">Get Free Audit</Link>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-20 px-5 md:px-8 bg-[#090f1d] border-y border-slate-800">
        <div className="mx-auto max-w-[1180px]">
          <h2 className="bf-title mb-10">More Articles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {content.blog.posts.filter((p) => p.slug !== slug).slice(0, 3).map((relatedPost, index) => (
              <Link key={index} href={`/blog/${relatedPost.slug}`} className="group block rounded-xl overflow-hidden border border-slate-700 bg-[#060b17] hover:border-[#c8ff57]/45 transition-colors">
                <div className="relative aspect-[16/10] overflow-hidden bg-[#0b1220]">
                  {relatedPost.image ? (
                    <Image
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-500">No image</div>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-[#c8ff57] font-semibold mb-2">{relatedPost.category}</p>
                  <h3 className="font-bold text-lg group-hover:text-[#c8ff57] transition-colors line-clamp-2">{relatedPost.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative z-10 bg-[#060b17] border-t border-slate-800 px-5 md:px-8 py-10">
        <div className="mx-auto max-w-[1180px] flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <span className="font-bold text-lg text-white">PYOW</span>
            <span className="block text-xs font-semibold tracking-wider text-[#c8ff57]">DIGITALS</span>
          </div>
          <p className="text-slate-500 text-sm">&copy; {new Date().getFullYear()} Pyow Digitals. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}

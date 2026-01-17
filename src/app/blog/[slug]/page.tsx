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
  
  const post = content.blog.posts.find(p => p.slug === slug)
  
  if (!post) {
    return (
      <main className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
        <Header />
        <div className="pt-32 pb-20 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Post Not Found</h1>
          <Link href="/blog" className="text-[#2f4a8a] dark:text-[#4a6cb3] hover:underline">
            Back to Blog
          </Link>
        </div>
      </main>
    )
  }

  const renderContent = (text: string) => {
    const lines = text.split('\n')
    return lines.map((line, index) => {
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">{line.replace('## ', '')}</h2>
      } else if (line.startsWith('- **')) {
        const match = line.match(/- \*\*(.+?)\*\*: (.+)/)
        if (match) {
          return (
            <li key={index} className="flex items-start mb-2">
              <span className="text-[#e8a030] mr-2">•</span>
              <span><strong className="text-gray-900 dark:text-white">{match[1]}:</strong> <span className="text-gray-600 dark:text-gray-400">{match[2]}</span></span>
            </li>
          )
        }
        return <li key={index} className="text-gray-600 dark:text-gray-400 mb-2">{line.replace('- ', '')}</li>
      } else if (line.trim() === '') {
        return <br key={index} />
      } else {
        return <p key={index} className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{line}</p>
      }
    })
  }

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      <Header />

      <section className="pt-32 pb-12 gradient-bg text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-20"></div>
        <div className="absolute top-10 right-10 w-64 h-64 bg-[#e8a030]/20 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Link href="/blog" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-white/20 text-white px-4 py-1 rounded-full text-sm font-semibold">{post.category}</span>
              <span className="text-white/80">{post.date}</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-shadow">{post.title}</h1>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-12 shadow-xl bg-gradient-to-br from-[#4a6cb3] to-[#2f4a8a]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 text-white/30 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-white/50">Featured Image</span>
                </div>
              </div>
            </div>

            <article className="prose prose-lg max-w-none">
              {renderContent(post.content)}
            </article>

            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#2f4a8a] to-[#4a6cb3] rounded-full flex items-center justify-center text-white font-bold mr-4">
                    P
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Pyow Digitals</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Web Design & Development</div>
                  </div>
                </div>
                <Link href="/#contact" className="btn-primary">
                  Work With Me
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#F8FAFC] dark:bg-slate-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">More Articles</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {content.blog.posts.filter(p => p.slug !== slug).slice(0, 3).map((relatedPost, index) => (
              <Link key={index} href={`/blog/${relatedPost.slug}`} className="group">
                <article className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-700">
                  <div className="h-32 bg-gradient-to-br from-[#4a6cb3] to-[#2f4a8a] flex items-center justify-center">
                    <svg className="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="p-4">
                    <span className="text-xs text-[#2f4a8a] dark:text-[#4a6cb3] font-semibold">{relatedPost.category}</span>
                    <h3 className="font-bold text-gray-900 dark:text-white mt-1 group-hover:text-[#2f4a8a] dark:group-hover:text-[#4a6cb3] transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 dark:bg-slate-950 text-white py-12 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div>
                <span className="font-bold text-lg text-white">PYOW</span>
                <span className="block text-xs font-semibold tracking-wider text-[#e8a030]">DIGITALS</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} Pyow Digitals. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

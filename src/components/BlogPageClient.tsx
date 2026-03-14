'use client'
import React, { useState, useMemo } from 'react'
import Header from '@/components/Header'
import content from '@/data/content.json'
import Link from 'next/link'
import Image from 'next/image'

const POSTS_PER_PAGE = 9

export default function BlogPageClient() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)

  const categories = useMemo(() => {
    const cats = new Set(content.blog.posts.map((post) => post.category))
    return ['All', ...Array.from(cats).sort()]
  }, [])

  const filteredPosts = useMemo(() => {
    const posts = activeCategory === 'All'
      ? content.blog.posts
      : content.blog.posts.filter((post) => post.category === activeCategory)
    return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [activeCategory])

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE
    return filteredPosts.slice(start, start + POSTS_PER_PAGE)
  }, [filteredPosts, currentPage])

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 300, behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen bg-[#060b17] text-slate-100">
      <Header />

      <section className="relative z-10 pt-32 pb-20 px-5 md:px-8 border-b border-slate-800 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(200,255,87,0.09),transparent_34%)]" />
        <div className="mx-auto max-w-[1180px] relative">
          <p className="bf-label">Blog</p>
          <h1 className="bf-title mb-4">{content.blog.title}</h1>
          <p className="bf-sub">{content.blog.subtitle}</p>
        </div>
      </section>

      <section id="blog" className="relative z-10 section-padding px-5 md:px-8 bg-[#090f1d]">
        <div className="mx-auto max-w-[1180px]">
          <div className="flex flex-wrap gap-3 mb-12">
            {categories.map((category, index) => {
              const isActive = activeCategory === category
              return (
                <button
                  key={index}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 border ${isActive
                    ? 'bg-[#c8ff57] text-[#070b15] border-[#c8ff57]'
                    : 'bg-[#060b17] text-slate-300 border-slate-700 hover:border-[#c8ff57]/45 hover:text-[#c8ff57]'
                  }`}
                >
                  {category}
                  {category !== 'All' && (
                    <span className={`ml-2 text-xs px-2 py-0.5 rounded ${isActive ? 'bg-black/15' : 'bg-slate-800 text-slate-400'}`}>
                      {content.blog.posts.filter((p) => p.category === category).length}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-20 border border-slate-800 rounded-xl bg-[#060b17]">
              <p className="text-slate-400 text-lg">No posts found in this category.</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedPosts.map((post, index) => (
                  <Link
                    key={`${post.slug}-${index}`}
                    href={`/blog/${post.slug}`}
                    className="group block rounded-xl overflow-hidden border border-slate-700 bg-[#060b17] hover:border-[#c8ff57]/45 transition-colors"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#0b1220]">
                      {post.image ? (
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-500">No image</div>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <span className="text-[11px] uppercase tracking-[0.12em] text-[#c8ff57] font-semibold">{post.category}</span>
                        <span className="text-xs text-slate-500">{post.date}</span>
                      </div>

                      <h2 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-[#c8ff57] transition-colors">
                        {post.title}
                      </h2>

                      <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`w-10 h-10 rounded-md border transition-colors ${
                      currentPage === 1
                        ? 'border-slate-800 text-slate-600 cursor-not-allowed'
                        : 'border-slate-700 text-slate-300 hover:text-[#c8ff57] hover:border-[#c8ff57]/40'
                    }`}
                  >
                    {'<'}
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-md border text-sm font-semibold transition-colors ${
                        currentPage === page
                          ? 'bg-[#c8ff57] text-[#070b15] border-[#c8ff57]'
                          : 'border-slate-700 text-slate-300 hover:text-[#c8ff57] hover:border-[#c8ff57]/40'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`w-10 h-10 rounded-md border transition-colors ${
                      currentPage === totalPages
                        ? 'border-slate-800 text-slate-600 cursor-not-allowed'
                        : 'border-slate-700 text-slate-300 hover:text-[#c8ff57] hover:border-[#c8ff57]/40'
                    }`}
                  >
                    {'>'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <section className="relative z-10 px-5 md:px-8 py-20 bg-[#060b17] border-y border-slate-800">
        <div className="mx-auto max-w-[900px] text-center">
          <h2 className="bf-title mb-4">Ready to Build Your Conversion System?</h2>
          <p className="text-slate-300 mb-8">Let&apos;s review your current setup and identify where leads are leaking.</p>
          <Link href="/#contact" className="bf-btn-main inline-flex">
            Get Free Audit
          </Link>
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

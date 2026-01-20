'use client'
import React, { useState, useMemo } from 'react'
import Header from '@/components/Header'
import content from '@/data/content.json'
import Link from 'next/link'
import Image from 'next/image'

const POSTS_PER_PAGE = 9

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)

  const categories = useMemo(() => {
    const cats = new Set(content.blog.posts.map(post => post.category))
    return ['All', ...Array.from(cats).sort()]
  }, [])

  const filteredPosts = useMemo(() => {
    const posts = activeCategory === 'All' 
      ? content.blog.posts 
      : content.blog.posts.filter(post => post.category === activeCategory)
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
    window.scrollTo({ top: 400, behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      <Header />

      <section className="pt-32 pb-20 gradient-bg text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-20"></div>
        <div className="absolute top-10 right-10 w-64 h-64 bg-[#e8a030]/20 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <span className="inline-block glass-effect text-white px-6 py-2 rounded-full text-sm font-medium mb-6">Our Blog</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-shadow">{content.blog.title}</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            {content.blog.subtitle}
          </p>
        </div>
      </section>

      <section id="blog" className="section-padding bg-[#F8FAFC] dark:bg-slate-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => handleCategoryChange(category)}
                className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 hover:scale-105 ${
                  activeCategory === category 
                    ? 'bg-gradient-to-r from-[#2f4a8a] to-[#4a6cb3] text-white shadow-lg' 
                    : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600 shadow-md hover:shadow-lg border border-gray-200 dark:border-slate-600'
                }`}
              >
                {category}
                {category !== 'All' && (
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                    activeCategory === category 
                      ? 'bg-white/20' 
                      : 'bg-gray-100 dark:bg-slate-600'
                  }`}>
                    {content.blog.posts.filter(p => p.category === category).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-500 dark:text-gray-400 text-lg">No posts found in this category.</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {paginatedPosts.map((post, index) => (
                  <Link 
                    key={`${post.slug}-${index}`} 
                    href={`/blog/${post.slug}`} 
                    className="group animate-fadeInUp"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <article className="card overflow-hidden p-0 border border-gray-100 dark:border-slate-700 h-full hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                      <div className="aspect-[16/10] bg-gradient-to-br from-[#4a6cb3] to-[#2f4a8a] flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[#e8a030]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        {post.image ? (
                          <Image 
                            src={post.image} 
                            alt={post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <svg className="w-12 h-12 text-white/30 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="bg-[#2f4a8a]/10 dark:bg-[#4a6cb3]/20 text-[#2f4a8a] dark:text-[#4a6cb3] px-3 py-1 rounded-full text-sm font-semibold">
                            {post.category}
                          </span>
                          <span className="text-sm text-gray-400">{post.date}</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-[#2f4a8a] dark:group-hover:text-[#4a6cb3] transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{post.excerpt}</p>
                        <span className="inline-flex items-center text-[#e8a030] font-semibold group-hover:gap-2 transition-all">
                          Read More
                          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      currentPage === 1 
                        ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    if (
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 rounded-lg font-medium transition-all duration-300 ${
                            currentPage === page 
                              ? 'bg-gradient-to-r from-[#2f4a8a] to-[#4a6cb3] text-white shadow-lg' 
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="text-gray-400">...</span>
                    }
                    return null
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      currentPage === totalPages 
                        ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}

              <div className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
                Showing {((currentPage - 1) * POSTS_PER_PAGE) + 1} - {Math.min(currentPage * POSTS_PER_PAGE, filteredPosts.length)} of {filteredPosts.length} posts
              </div>
            </>
          )}
        </div>
      </section>

      <section className="py-20 gradient-bg text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-bold mb-4 text-shadow">Ready to Start Your Project?</h2>
          <p className="text-white/90 mb-8 max-w-xl mx-auto">
            Let&apos;s discuss how I can help bring your vision to life.
          </p>
          <Link href="/#contact" className="btn-accent inline-block hover:scale-105 transition-transform">
            Get in Touch
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 dark:bg-slate-950 text-white py-16 transition-colors duration-300">
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

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </main>
  )
}

'use client'
import React from 'react'
import Header from '@/components/Header'
import content from '@/data/content.json'
import Link from 'next/link'

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="pt-32 pb-20 gradient-bg text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            {content.blog.subtitle}
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {content.blog.posts.map((post, index) => (
              <article key={index} className="card card-hover overflow-hidden p-0 border border-gray-100">
                <div className="h-48 bg-gradient-to-br from-[#6BAED6] to-[#2171B5] flex items-center justify-center">
                  <span className="text-white/50 text-sm">Blog Image</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-[#EFF3FF] text-[#2171B5] px-3 py-1 rounded-full text-sm font-medium">{post.category}</span>
                    <span className="text-sm text-gray-400">{post.date}</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-[#2171B5] transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-[#2171B5] font-medium hover:underline"
                  >
                    Read More
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 gradient-bg text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
          <p className="text-white/90 mb-8 max-w-xl mx-auto">
            Let&apos;s discuss how I can help bring your vision to life.
          </p>
          <Link href="/#contact" className="btn-white">
            Get in Touch
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-[#2171B5] text-white px-2 py-1 rounded font-bold text-sm">OS</span>
                <span className="font-semibold">Olympio</span>
              </div>
              <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} {content.footer.copyright}</p>
            </div>
            <div className="flex space-x-6">
              {content.footer.links.map((link, index) => (
                <a key={index} href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

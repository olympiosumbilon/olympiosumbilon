'use client'
import React from 'react'
import Header from '@/components/Header'
import content from '@/data/content.json'
import Link from 'next/link'
import Image from 'next/image'

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="pt-32 pb-20 gradient-bg text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-20"></div>
        <div className="absolute top-10 right-10 w-64 h-64 bg-[#e8a030]/20 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <span className="inline-block glass-effect text-white px-6 py-2 rounded-full text-sm font-medium mb-6">Our Blog</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-shadow">Blog</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            {content.blog.subtitle}
          </p>
        </div>
      </section>

      <section className="section-padding bg-mesh">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {content.blog.posts.map((post, index) => (
              <article key={index} className="interactive-card card overflow-hidden p-0 border border-gray-100 group">
                <div className="h-48 bg-gradient-to-br from-[#4a6cb3] to-[#2f4a8a] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#e8a030]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="text-white/50 text-sm">Blog Image</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-[#2f4a8a]/10 text-[#2f4a8a] px-3 py-1 rounded-full text-sm font-semibold">{post.category}</span>
                    <span className="text-sm text-gray-400">{post.date}</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#2f4a8a] transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <span className="inline-flex items-center text-[#e8a030] font-semibold">
                    Coming Soon
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 gradient-bg text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-bold mb-4 text-shadow">Ready to Start Your Project?</h2>
          <p className="text-white/90 mb-8 max-w-xl mx-auto">
            Let&apos;s discuss how I can help bring your vision to life.
          </p>
          <Link href="/#contact" className="btn-accent inline-block">
            Get in Touch
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <Image 
                src="/favicon.png" 
                alt="Pyow Digitals" 
                width={40} 
                height={40}
                className="rounded-full"
              />
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

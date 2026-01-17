'use client'
import React, { useEffect, useState } from 'react'
import Header from '@/components/Header'
import ContactForm from '@/components/ContactForm'
import SocialLinks from '@/components/SocialLinks'
import content from '@/data/content.json'
import Image from 'next/image'

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
  }, [])

  const filteredProjects = activeCategory === 'All' 
    ? content.portfolio.projects 
    : content.portfolio.projects.filter(p => p.category === activeCategory)

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center gradient-bg text-white pt-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              {content.hero.tagline}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {content.hero.title}
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              {content.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <a href={content.hero.ctaButton.href} className="btn-white">
                {content.hero.ctaButton.text}
              </a>
              <a href={content.hero.secondaryButton.href} className="btn-secondary border-white text-white hover:bg-white hover:text-[#2171B5]">
                {content.hero.secondaryButton.text}
              </a>
            </div>
            <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
              {content.hero.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold">{stat.number}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Services Section */}
      <section id="services" className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="section-title">{content.services.title}</h2>
            <p className="section-subtitle">{content.services.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {content.services.items.map((service, index) => (
              <div key={index} className="card card-hover border border-gray-100">
                <div className="w-14 h-14 bg-[#EFF3FF] rounded-xl flex items-center justify-center mb-6">
                  {service.icon === 'design' ? (
                    <svg className="w-7 h-7 text-[#2171B5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  ) : (
                    <svg className="w-7 h-7 text-[#2171B5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-700">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Carousel Section */}
      <section className="py-16 bg-[#F8FAFC]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">{content.tools.title}</h2>
            <p className="section-subtitle">{content.tools.subtitle}</p>
          </div>
          <div className="overflow-hidden">
            <div className="tools-carousel">
              {[...content.tools.items, ...content.tools.items].map((tool, index) => (
                <div key={index} className="flex-shrink-0 mx-4">
                  <div className="bg-white rounded-xl shadow-md px-8 py-6 min-w-[180px] text-center hover:shadow-lg transition-shadow">
                    <div className="font-semibold text-gray-900">{tool.name}</div>
                    <div className="text-sm text-[#2171B5]">{tool.category}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="section-title">{content.pricing.title}</h2>
            <p className="section-subtitle">{content.pricing.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {content.pricing.tiers.map((tier, index) => (
              <div key={index} className={`card relative ${tier.popular ? 'border-2 border-[#2171B5] scale-105' : 'border border-gray-100'}`}>
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#2171B5] text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                  <div className="text-4xl font-bold text-[#2171B5] mb-2">{tier.price}</div>
                  <p className="text-gray-600 text-sm">{tier.description}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start text-gray-700">
                      <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <a href="#contact" className={`block text-center py-3 px-6 rounded-full font-semibold transition-all ${tier.popular ? 'bg-[#2171B5] text-white hover:bg-[#08519c]' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}>
                  {tier.ctaText}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="section-padding bg-[#F8FAFC]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">{content.portfolio.title}</h2>
            <p className="section-subtitle">{content.portfolio.subtitle}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {content.portfolio.categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${activeCategory === category ? 'bg-[#2171B5] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <div key={index} className="card card-hover overflow-hidden p-0">
                <div className="h-48 bg-gradient-to-br from-[#2171B5] to-[#6BAED6] flex items-center justify-center">
                  <span className="text-white/50 text-sm">Project Image</span>
                </div>
                <div className="p-6">
                  <span className="inline-block bg-[#EFF3FF] text-[#2171B5] px-3 py-1 rounded-full text-sm font-medium mb-3">
                    {project.category}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-600">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="section-title">{content.testimonials.title}</h2>
            <p className="section-subtitle">{content.testimonials.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {content.testimonials.items.map((testimonial, index) => (
              <div key={index} className="card border border-gray-100">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">&quot;{testimonial.content}&quot;</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#2171B5] rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="section-padding bg-[#F8FAFC]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">{content.blog.title}</h2>
            <p className="section-subtitle">{content.blog.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {content.blog.posts.map((post, index) => (
              <article key={index} className="card card-hover overflow-hidden p-0">
                <div className="h-40 bg-gradient-to-br from-[#6BAED6] to-[#2171B5] flex items-center justify-center">
                  <span className="text-white/50 text-sm">Blog Image</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm text-[#2171B5] font-medium">{post.category}</span>
                    <span className="text-sm text-gray-400">{post.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-[#2171B5] transition-colors">
                    <a href="/blog">{post.title}</a>
                  </h3>
                  <p className="text-gray-600 text-sm">{post.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="text-center mt-10">
            <a href="/blog" className="btn-secondary">
              View All Posts
            </a>
          </div>
        </div>
      </section>

      {/* CTA / Contact Section */}
      <section id="contact" className="section-padding gradient-bg text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{content.contact.title}</h2>
              <p className="text-lg text-white/90 max-w-2xl mx-auto">{content.contact.subtitle}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
              <ContactForm />
            </div>
            <div className="mt-8 flex justify-center">
              <SocialLinks />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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

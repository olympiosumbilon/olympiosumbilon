'use client'
import React, { useEffect, useState } from 'react'
import Header from '@/components/Header'
import ContactForm from '@/components/ContactForm'
import SocialLinks from '@/components/SocialLinks'
import ToolIcon from '@/components/ToolIcon'
import FAQ from '@/components/FAQ'
import FloatingContact from '@/components/FloatingContact'
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
    <main className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center gradient-bg text-white pt-20 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 bg-mesh opacity-30"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#e8a030]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        
        {/* Mockup Images in Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[15%] -right-[5%] w-[450px] h-[300px] opacity-20 blur-[2px] rotate-12 animate-float pointer-events-none">
            <Image 
              src="/attached_assets/generated_images/modern_dark_website_mockup_laptop.png"
              alt="Website Mockup 1"
              width={500}
              height={300}
              className="rounded-2xl shadow-2xl object-cover"
            />
          </div>
          <div className="absolute bottom-[15%] -left-[5%] w-[400px] h-[280px] opacity-15 blur-[4px] -rotate-12 animate-float-delayed pointer-events-none">
            <Image 
              src="/attached_assets/generated_images/modern_dark_website_mockup_laptop.png"
              alt="Website Mockup 2"
              width={500}
              height={300}
              className="rounded-2xl shadow-2xl object-cover flip-horizontal"
            />
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block glass-effect text-white px-6 py-2 rounded-full text-sm font-medium mb-8 animate-fadeInUp">
              {content.hero.tagline}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-shadow animate-shimmer bg-clip-text text-transparent bg-gradient-to-r from-white via-[#f0b840] to-white bg-[length:200%_auto]" style={{animationDelay: '0.1s'}}>
              {content.hero.title}
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto animate-fadeInUp" style={{animationDelay: '0.2s'}}>
              {content.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fadeInUp" style={{animationDelay: '0.3s'}}>
              <a href={content.hero.ctaButton.href} className="btn-accent">
                {content.hero.ctaButton.text}
              </a>
              <a href={content.hero.secondaryButton.href} className="btn-secondary border-white text-white hover:bg-white hover:text-[#2f4a8a]">
                {content.hero.secondaryButton.text}
              </a>
            </div>
            <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fadeInUp" style={{animationDelay: '0.4s'}}>
              {content.hero.stats.map((stat, index) => (
                <div key={index} className="text-center glass-effect rounded-xl py-4 px-2 hover-lift">
                  <div className="text-3xl md:text-4xl font-bold text-[#f0b840]">{stat.number}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-slate-900 to-transparent"></div>
      </section>

      {/* Problem Section - Pain Points */}
      <section className="section-padding bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="section-title">{content.problem.title}</h2>
            <p className="section-subtitle">{content.problem.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
            {content.problem.items.map((item, index) => (
              <div key={index} className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-8 border border-gray-100 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-900 transition-all duration-300 group text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:bg-red-500/20 transition-colors">
                  {item.icon === 'frustrated' && (
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {item.icon === 'invisible' && (
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                  {item.icon === 'confused' && (
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto font-medium">
              {content.problem.cta}
            </p>
          </div>
        </div>
      </section>

      {/* Failed Solutions Section */}
      <section className="section-padding bg-[#F8FAFC] dark:bg-slate-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="section-title">{content.failedSolutions.title}</h2>
            <p className="section-subtitle">{content.failedSolutions.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
            {content.failedSolutions.items.map((item, index) => (
              <div key={index} className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-gray-200 dark:border-slate-700 relative overflow-hidden group">
                <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto italic">
              {content.failedSolutions.conclusion}
            </p>
          </div>
        </div>
      </section>

      {/* Regrets Section - Frame of Regrets */}
      <section className="section-padding bg-gradient-to-br from-gray-900 to-slate-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.regrets.title}</h2>
            <p className="text-white/70 max-w-2xl mx-auto">{content.regrets.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
            {content.regrets.items.map((item, index) => (
              <div key={index} className="text-center p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                  {item.icon === 'money' && (
                    <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {item.icon === 'clock' && (
                    <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {item.icon === 'users' && (
                    <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  )}
                </div>
                <div className="text-4xl font-bold text-red-400 mb-2">{item.stat}</div>
                <p className="text-white/70">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-xl text-red-400 font-semibold max-w-2xl mx-auto">
              {content.regrets.cta}
            </p>
          </div>
        </div>
      </section>

      {/* USP Section */}
      <section className="section-padding bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">{content.usp.title}</h2>
            <p className="section-subtitle">{content.usp.subtitle}</p>
          </div>
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#2f4a8a] dark:text-[#4a6cb3] mb-6">
              {content.usp.headline}
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              {content.usp.description}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {content.usp.points.map((point, index) => (
              <div key={index} className="bg-gradient-to-br from-[#2f4a8a]/5 to-[#4a6cb3]/5 dark:from-slate-800 dark:to-slate-800 rounded-2xl p-6 border border-[#2f4a8a]/10 dark:border-slate-700 text-center group hover:border-[#e8a030] transition-all duration-300">
                <div className="w-12 h-12 bg-[#e8a030] rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{point.title}</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transition Section - Slow Pitch */}
      <section className="section-padding gradient-bg text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-20"></div>
        <div className="absolute top-10 right-10 w-64 h-64 bg-[#e8a030]/20 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-shadow">
              {content.transition.title}
            </h2>
            <p className="text-lg text-white/80 mb-10">{content.transition.subtitle}</p>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-10 border border-white/20">
              <ul className="space-y-4 text-left max-w-2xl mx-auto mb-10">
                {content.transition.items.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-6 h-6 bg-[#e8a030] rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-white/90 text-lg">{item}</span>
                  </li>
                ))}
              </ul>
              
              <div className="text-center border-t border-white/10 pt-8">
                <p className="text-white/60 text-sm uppercase tracking-widest mb-6 font-bold">Quick Contact</p>
                <div className="text-center">
                  <p className="text-white/90 text-lg mb-4">Click the floating contact button in the bottom right corner to reach out!</p>
                </div>
              </div>
            </div>
            <p className="text-xl font-semibold text-[#f0b840] mb-8">{content.transition.cta}</p>
            <a href="#services" className="btn-accent inline-block">
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section-padding bg-[#F8FAFC] dark:bg-slate-800 bg-mesh transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="section-title">{content.services.title}</h2>
            <p className="section-subtitle">{content.services.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {content.services.items.map((service, index) => (
              <div key={index} className="interactive-card card border border-gray-100 dark:border-slate-700 group">
                <div className="w-16 h-16 bg-gradient-to-br from-[#2f4a8a] to-[#4a6cb3] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  {service.icon === 'design' && (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  )}
                  {service.icon === 'code' && (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  )}
                  {service.icon === 'strategy' && (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  )}
                  {service.icon === 'social' && (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  )}
                  {service.icon === 'email' && (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )}
                  {service.icon === 'funnel' && (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-[#2f4a8a] dark:group-hover:text-[#4a6cb3] transition-colors">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{service.description}</p>
                <ul className="space-y-3">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-700 dark:text-gray-300">
                      <div className="w-5 h-5 bg-[#e8a030]/20 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-3 h-3 text-[#e8a030]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
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
      <section className="py-20 bg-gradient-to-b from-[#F8FAFC] dark:from-slate-800 to-white dark:to-slate-900 overflow-hidden transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">{content.tools.title}</h2>
            <p className="section-subtitle">{content.tools.subtitle}</p>
          </div>
          <div className="overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#F8FAFC] dark:from-slate-800 to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-10"></div>
            <div className="tools-carousel">
              {[...content.tools.items, ...content.tools.items].map((tool, index) => (
                <div key={index} className="flex-shrink-0 mx-3">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl px-6 py-5 min-w-[160px] text-center transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-slate-700 group">
                    <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <ToolIcon name={tool.name} className="w-10 h-10" />
                    </div>
                    <div className="font-bold text-gray-900 dark:text-white text-sm">{tool.name}</div>
                    <div className="text-xs text-[#2f4a8a] dark:text-[#4a6cb3] font-medium">{tool.category}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="section-padding bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="section-title">{content.pricing.title}</h2>
            <p className="section-subtitle">{content.pricing.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {content.pricing.tiers.map((tier, index) => (
              <div key={index} className={`interactive-card card relative ${tier.popular ? 'border-2 border-[#e8a030] md:scale-105 z-10' : 'border border-gray-100 dark:border-slate-700'}`}>
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 accent-gradient text-white px-6 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{tier.name}</h3>
                  <div className="mb-1">
                    <span className="text-lg text-gray-400 line-through mr-2">{tier.originalPrice}</span>
                    <span className="inline-block bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-semibold px-2 py-1 rounded-full">{tier.savings}</span>
                  </div>
                  <div className={`text-4xl font-bold mb-2 ${tier.popular ? 'text-[#e8a030]' : 'text-[#2f4a8a] dark:text-[#4a6cb3]'}`}>{tier.price}</div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{tier.description}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start text-gray-700 dark:text-gray-300">
                      <svg className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${tier.popular ? 'text-[#e8a030]' : 'text-green-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <a href="#contact" className={`block text-center py-3 px-6 rounded-full font-semibold transition-all duration-300 ${tier.popular ? 'accent-gradient text-white hover:shadow-lg hover:scale-105' : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-[#2f4a8a] hover:text-white'}`}>
                  {tier.ctaText}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="section-padding bg-[#F8FAFC] dark:bg-slate-800 transition-colors duration-300">
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
                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${activeCategory === category ? 'bg-gradient-to-r from-[#2f4a8a] to-[#4a6cb3] text-white shadow-lg' : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600 shadow-md hover:shadow-lg'}`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <div key={index} className="interactive-card card overflow-hidden p-0 group border border-gray-100 dark:border-slate-700">
                <div className="h-48 bg-gradient-to-br from-[#2f4a8a] to-[#4a6cb3] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#e8a030]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="text-white/50 text-sm group-hover:scale-110 transition-transform duration-300">Project Image</span>
                </div>
                <div className="p-6">
                  <span className="inline-block bg-[#2f4a8a]/10 dark:bg-[#4a6cb3]/20 text-[#2f4a8a] dark:text-[#4a6cb3] px-3 py-1 rounded-full text-sm font-medium mb-3">
                    {project.category}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-[#2f4a8a] dark:group-hover:text-[#4a6cb3] transition-colors">{project.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section id="about" className="section-padding bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-full h-full bg-gradient-to-br from-[#2f4a8a] to-[#4a6cb3] rounded-3xl"></div>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <Image 
                    src={content.founder.image}
                    alt="Olympio - Founder of Pyow Digitals"
                    width={500}
                    height={600}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
              <div>
                <span className="inline-block bg-[#e8a030]/10 text-[#e8a030] px-4 py-1 rounded-full text-sm font-semibold mb-4">
                  {content.founder.tagline}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {content.founder.title}
                </h2>
                <p className="text-lg text-[#2f4a8a] dark:text-[#4a6cb3] font-medium mb-6">
                  {content.founder.subtitle}
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  {content.founder.description}
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                  {content.founder.story}
                </p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {content.founder.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center">
                      <svg className="w-5 h-5 text-[#e8a030] mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{highlight}</span>
                    </div>
                  ))}
                </div>
                <a href="#contact" className="btn-accent inline-flex items-center">
                  Let's Work Together
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="section-padding bg-white dark:bg-slate-900 transition-colors duration-300 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="section-title">{content.testimonials.title}</h2>
            <p className="section-subtitle">{content.testimonials.subtitle}</p>
          </div>
          
          <div className="relative max-w-6xl mx-auto">
            <div className="testimonials-carousel">
              {[...content.testimonials.items, ...content.testimonials.items].map((testimonial, index) => (
                <div key={index} className="flex-shrink-0 w-[400px] px-4">
                  <div className="interactive-card card h-full border border-gray-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-[#e8a030] fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 italic mb-8 leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-[#2f4a8a] rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white leading-tight">{testimonial.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="section-padding bg-[#F8FAFC] dark:bg-slate-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">{content.faq.title}</h2>
            <p className="section-subtitle">{content.faq.subtitle}</p>
          </div>
          <div className="max-w-3xl mx-auto">
            <FAQ items={content.faq.items} />
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="section-padding bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">{content.blog.title}</h2>
            <p className="section-subtitle">{content.blog.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {content.blog.posts.map((post, index) => (
              <a key={index} href={`/blog/${post.slug}`} className="group">
                <article className="interactive-card card overflow-hidden p-0 border border-gray-100 dark:border-slate-700 h-full">
                  <div className="h-40 bg-gradient-to-br from-[#4a6cb3] to-[#2f4a8a] flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#e8a030]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <svg className="w-10 h-10 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm text-[#2f4a8a] dark:text-[#4a6cb3] font-semibold">{post.category}</span>
                      <span className="text-sm text-gray-400">{post.date}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-[#2f4a8a] dark:group-hover:text-[#4a6cb3] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{post.excerpt}</p>
                  </div>
                </article>
              </a>
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
      <section id="contact" className="section-padding gradient-bg text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-20"></div>
        <div className="absolute top-10 right-10 w-64 h-64 bg-[#e8a030]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-shadow">{content.contact.title}</h2>
              <p className="text-lg text-white/90 max-w-2xl mx-auto">{content.contact.subtitle}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 md:p-12">
              <ContactForm />
            </div>
            <div className="mt-8 text-center">
              <p className="text-white/80 mb-4">Or reach me directly on WhatsApp</p>
              <a
                href="https://wa.me/639357258656?text=Hi%20Pyow%20Digitals!%20I'm%20interested%20in%20your%20web%20design%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>
            <div className="mt-8 flex justify-center">
              <SocialLinks />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-slate-950 text-white py-16 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <div>
                  <span className="font-bold text-xl text-white">PYOW</span>
                  <span className="block text-sm font-semibold tracking-wider text-[#e8a030]">DIGITALS</span>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Transforming ideas into stunning, high-converting websites. We help businesses grow their online presence with professional web design and development services.
              </p>
              <div className="flex space-x-4">
                <a href="https://github.com/olympiosumbilon" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-[#e8a030] rounded-full flex items-center justify-center transition-all duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
                <a href="https://www.facebook.com/olympiosumbilonjr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-[#e8a030] rounded-full flex items-center justify-center transition-all duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://www.linkedin.com/in/olympiosumbilonjr/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-[#e8a030] rounded-full flex items-center justify-center transition-all duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#services" className="text-gray-400 hover:text-[#e8a030] transition-colors">Services</a></li>
                <li><a href="#portfolio" className="text-gray-400 hover:text-[#e8a030] transition-colors">Portfolio</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-[#e8a030] transition-colors">Pricing</a></li>
                <li><a href="/blog" className="text-gray-400 hover:text-[#e8a030] transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Contact</h4>
              <ul className="space-y-2">
                <li><a href="#contact" className="text-gray-400 hover:text-[#e8a030] transition-colors">Get in Touch</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#e8a030] transition-colors">Book a Call</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Pyow Digitals. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {content.footer.links.map((link, index) => (
                <a key={index} href={link.href} className="text-gray-400 hover:text-[#e8a030] text-sm transition-colors">
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <FloatingContact />
    </main>
  )
}

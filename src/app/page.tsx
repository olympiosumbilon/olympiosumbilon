'use client'
import React, { useEffect } from 'react'
import Header from '@/components/Header'
import ContactForm from '@/components/ContactForm'
import SocialLinks from '@/components/SocialLinks'
import FloatingContact from '@/components/FloatingContact'
import ScrollToTop from '@/components/ScrollToTop'
import ScrollReveal from '@/components/ScrollReveal'
import content from '@/data/content.json'
import Image from 'next/image'
import heroImage from '@/images/assets/modern_dark_website_mockup_laptop.png'

const renderServiceIcon = (icon: string) => {
  if (icon === 'design') {
    return (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    )
  }

  if (icon === 'code') {
    return (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    )
  }

  if (icon === 'email') {
    return (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  }

  return (
    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  )
}

export default function Home() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
  }, [])

  return (
    <main className="min-h-screen bg-[#060b17] transition-colors duration-300">
      <Header />

      <section className="relative min-h-screen flex items-center gradient-bg text-white pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-25"></div>
        <div className="absolute top-24 right-10 w-72 h-72 bg-[#e8a030]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-16 left-8 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <ScrollReveal>
              <div>
                <span className="inline-block glass-effect text-white px-5 py-2 rounded-full text-sm font-medium mb-6">
                  {content.hero.tagline}
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5 text-shadow">
                  {content.hero.title}
                </h1>
                <p className="text-lg md:text-xl text-white/90 mb-8 max-w-xl">
                  {content.hero.subtitle}
                </p>

                <ul className="space-y-3 mb-8">
                  {content.hero.bullets.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-6 h-6 rounded-full bg-[#e8a030] text-[#0b1020] flex items-center justify-center text-xs mr-3 mt-0.5 font-bold">+</span>
                      <span className="text-white/95">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a href={content.hero.ctaButton.href} className="btn-accent text-center">
                    {content.hero.ctaButton.text}
                  </a>
                  <a href={content.hero.secondaryButton.href} className="btn-secondary text-center">
                    {content.hero.secondaryButton.text}
                  </a>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={150} direction="right">
              <div className="relative">
                <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-white/10 backdrop-blur-lg p-4 md:p-6">
                  <Image
                    src={heroImage}
                    alt="Automation and CRM dashboard"
                    width={900}
                    height={650}
                    priority
                    className="w-full h-auto rounded-2xl"
                  />
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  <div className="glass-effect rounded-xl px-3 py-2 text-center text-xs font-semibold">Funnel Flow</div>
                  <div className="glass-effect rounded-xl px-3 py-2 text-center text-xs font-semibold">Automation</div>
                  <div className="glass-effect rounded-xl px-3 py-2 text-center text-xs font-semibold">CRM Pipeline</div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="section-padding bg-[#060b17] transition-colors duration-300">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="section-title">{content.problem.title}</h2>
              <p className="section-subtitle">{content.problem.subtitle}</p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-10">
            {content.problem.items.map((item, index) => (
              <ScrollReveal key={index} delay={100 + index * 80}>
                <article className="card border border-red-100 dark:border-red-900/30 h-full">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center font-bold mb-4">{index + 1}</div>
                  <h3 className="text-lg font-bold text-slate-100 mb-2">{item.title}</h3>
                  <p className="text-slate-300/80 text-sm leading-relaxed">{item.description}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={350}>
            <p className="text-center text-lg md:text-xl text-slate-200 font-medium max-w-3xl mx-auto">
              {content.problem.cta}
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section id="solutions" className="section-padding bg-[#0b1220] transition-colors duration-300">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="section-title">{content.solution.title}</h2>
              <p className="section-subtitle">{content.solution.subtitle}</p>
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <ScrollReveal delay={100}>
              <div className="card border border-gray-100 dark:border-slate-700 h-full">
                <h3 className="text-xl font-bold text-slate-100 mb-5">System Features</h3>
                <ul className="space-y-3">
                  {content.solution.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-slate-200">
                      <span className="w-5 h-5 rounded-full bg-[#e8a030]/20 text-[#e8a030] flex items-center justify-center text-[10px] mr-3">+</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={180}>
              <div className="card border border-gray-100 dark:border-slate-700 h-full">
                <h3 className="text-xl font-bold text-slate-100 mb-5">System Flow</h3>
                <div className="flex flex-wrap items-center gap-2">
                  {content.solution.flow.map((node, index) => (
                    <React.Fragment key={node}>
                      <span className="px-4 py-2 rounded-full bg-gradient-to-r from-[#2f4a8a] to-[#4a6cb3] text-white text-sm font-semibold shadow-md">
                        {node}
                      </span>
                      {index < content.solution.flow.length - 1 && <span className="text-[#e8a030] font-bold">{'>'}</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="section-padding bg-[#060b17] transition-colors duration-300">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="section-title">{content.howItWorks.title}</h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {content.howItWorks.steps.map((step, index) => (
              <ScrollReveal key={index} delay={120 + index * 100}>
                <article className="card border border-gray-100 dark:border-slate-700 h-full">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#2f4a8a]/10 text-[#2f4a8a] dark:bg-[#4a6cb3]/20 dark:text-[#4a6cb3] mb-4">
                    Step {index + 1}
                  </span>
                  <h3 className="text-xl font-bold text-slate-100 mb-3">{step.title}</h3>
                  <p className="text-slate-300/80">{step.description}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-[#0b1220] bg-mesh transition-colors duration-300">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="section-title">{content.services.title}</h2>
              <p className="section-subtitle">{content.services.subtitle}</p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {content.services.items.map((service, index) => (
              <ScrollReveal key={index} delay={100 + index * 80}>
                <article className="interactive-card card border border-gray-100 dark:border-slate-700 h-full">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#2f4a8a] to-[#4a6cb3] rounded-2xl flex items-center justify-center mb-5 shadow-lg">
                    {renderServiceIcon(service.icon)}
                  </div>
                  <h3 className="text-xl font-bold text-slate-100 mb-2">{service.title}</h3>
                  <p className="text-slate-300/80 text-sm mb-4">{service.description}</p>

                  <ul className="space-y-2 mb-5">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-sm text-slate-200 flex items-start">
                        <span className="text-[#e8a030] mr-2">•</span>{feature}
                      </li>
                    ))}
                  </ul>

                  <p className="text-sm font-semibold text-[#2f4a8a] dark:text-[#4a6cb3]">Outcome: {service.outcome}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-[#060b17] transition-colors duration-300">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="section-title">{content.idealClients.title}</h2>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto mb-8">
            {content.idealClients.industries.map((industry, index) => (
              <ScrollReveal key={index} delay={100 + index * 60}>
                <div className="rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-5 text-center font-semibold text-slate-100 h-full">
                  {industry}
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={360}>
            <p className="text-center text-slate-300/80 max-w-3xl mx-auto text-lg">
              {content.idealClients.description}
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section id="case-studies" className="section-padding bg-[#0b1220] transition-colors duration-300">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="section-title">{content.caseStudies.title}</h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {content.caseStudies.items.map((study, index) => (
              <ScrollReveal key={index} delay={120 + index * 100}>
                <article className="card border border-gray-100 dark:border-slate-700 h-full">
                  <h3 className="text-2xl font-bold text-slate-100 mb-5">{study.name}</h3>

                  <div className="mb-4">
                    <p className="text-sm uppercase tracking-wide text-slate-400 mb-1">Problem</p>
                    <p className="text-slate-200">{study.problem}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm uppercase tracking-wide text-slate-400 mb-1">Solution</p>
                    <ul className="space-y-1">
                      {study.solution.map((item, solutionIndex) => (
                        <li key={solutionIndex} className="text-slate-200"><span className="text-[#e8a030] mr-2">•</span>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-sm uppercase tracking-wide text-slate-400 mb-1">Outcome</p>
                    <p className="font-semibold text-[#2f4a8a] dark:text-[#4a6cb3]">{study.outcome}</p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="section-padding bg-[#060b17] transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-full h-full bg-gradient-to-br from-[#2f4a8a] to-[#4a6cb3] rounded-3xl"></div>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src={content.founder.image}
                    alt="Founder of Pyow Digitals"
                    width={500}
                    height={600}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </ScrollReveal>

            <div>
              <ScrollReveal delay={120}>
                <span className="inline-block bg-[#e8a030]/10 text-[#e8a030] px-4 py-1 rounded-full text-sm font-semibold mb-4">
                  {content.founder.tagline}
                </span>
              </ScrollReveal>

              <ScrollReveal delay={180}>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">{content.founder.title}</h2>
              </ScrollReveal>

              <ScrollReveal delay={240}>
                <p className="text-lg text-slate-300/80 mb-5">{content.founder.description}</p>
              </ScrollReveal>

              <ScrollReveal delay={300}>
                <p className="text-slate-300/80 mb-7 leading-relaxed">{content.founder.story}</p>
              </ScrollReveal>

              <ScrollReveal delay={360}>
                <ul className="space-y-2">
                  {content.founder.highlights.map((highlight, index) => (
                    <li key={index} className="text-slate-200">
                      <span className="text-[#e8a030] mr-2">•</span>{highlight}
                    </li>
                  ))}
                </ul>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="section-padding gradient-bg text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-20"></div>
        <div className="absolute top-8 right-8 w-72 h-72 bg-[#e8a030]/20 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-5xl font-bold mb-4 text-shadow">{content.contact.title}</h2>
                <p className="text-lg text-white/90 max-w-2xl mx-auto mb-6">{content.contact.subtitle}</p>
                <ul className="inline-flex flex-col sm:flex-row gap-3 text-sm sm:text-base">
                  {content.contact.benefits.map((benefit, index) => (
                    <li key={index} className="glass-effect rounded-full px-4 py-2">{benefit}</li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={140}>
              <div className="bg-slate-900/80 border border-slate-700 rounded-3xl shadow-2xl p-8 md:p-12">
                <ContactForm />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section id="resources" className="section-padding bg-[#060b17] transition-colors duration-300">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="section-title">{content.blog.title}</h2>
              <p className="section-subtitle">{content.blog.subtitle}</p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[...content.blog.posts]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 3)
              .map((post, index) => (
                <ScrollReveal key={index} delay={100 + index * 80}>
                  <a href={`/blog/${post.slug}`} className="group block h-full">
                    <article className="interactive-card card overflow-hidden p-0 border border-gray-100 dark:border-slate-700 h-full">
                      <div className="aspect-[16/10] bg-gradient-to-br from-[#4a6cb3] to-[#2f4a8a] relative overflow-hidden">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 420px"
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6">
                        <p className="text-sm text-[#2f4a8a] dark:text-[#4a6cb3] font-semibold mb-2">{post.category}</p>
                        <h3 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-[#2f4a8a] dark:group-hover:text-[#4a6cb3] transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-slate-300/80 text-sm">{post.excerpt}</p>
                      </div>
                    </article>
                  </a>
                </ScrollReveal>
              ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 dark:bg-slate-950 text-white py-16 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-10 mb-12">
            <div>
              <div className="mb-4">
                <span className="font-bold text-xl text-white">PYOW</span>
                <span className="block text-sm font-semibold tracking-wider text-[#e8a030]">DIGITALS</span>
              </div>
              <p className="text-gray-400 max-w-md">{content.footer.description}</p>
              <a href="#contact" className="inline-block mt-5 btn-accent">{content.footer.cta}</a>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-[#e8a030] transition-colors">Home</a></li>
                <li><a href="#solutions" className="hover:text-[#e8a030] transition-colors">Solutions</a></li>
                <li><a href="#case-studies" className="hover:text-[#e8a030] transition-colors">Case Studies</a></li>
                <li><a href="#about" className="hover:text-[#e8a030] transition-colors">About</a></li>
                <li><a href="/blog" className="hover:text-[#e8a030] transition-colors">Blog</a></li>
                <li><a href="#contact" className="hover:text-[#e8a030] transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="mailto:olympiosumbilonpersonal@gmail.com" className="hover:text-[#e8a030] transition-colors">Email</a></li>
                <li><a href="https://www.linkedin.com/in/olympiosumbilonjr/" target="_blank" rel="noopener noreferrer" className="hover:text-[#e8a030] transition-colors">LinkedIn</a></li>
                <li><a href="https://www.facebook.com/olympiosumbilonjr" target="_blank" rel="noopener noreferrer" className="hover:text-[#e8a030] transition-colors">Facebook</a></li>
              </ul>
              <div className="mt-6">
                <SocialLinks />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">&copy; {new Date().getFullYear()} Pyow Digitals. All rights reserved.</p>
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
      <ScrollToTop />
    </main>
  )
}



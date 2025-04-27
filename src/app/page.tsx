'use client'
import React from 'react'
import Header from '@/components/Header'
import ContactForm from '@/components/ContactForm'
import SocialLinks from '@/components/SocialLinks'
import content from '@/data/content.json'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#EFF3FF]">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-[#2171B5] text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">{content.hero.title}</h1>
          <p className="text-xl md:text-2xl mb-8">{content.hero.subtitle}</p>
          <button className="bg-[#6BAED6] hover:bg-[#BDD7E7] text-white font-bold py-3 px-8 rounded-full transition-colors">
            {content.hero.ctaButton.text}
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-[#2171B5] mb-12 text-center">{content.about.title}</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {content.about.content.map((paragraph, index) => (
                <p key={index} className="text-gray-700 text-lg">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-[#BDD7E7]"></div>
              {/* Add your image here */}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-[#EFF3FF]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-[#2171B5] mb-12 text-center">{content.services.title}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {content.services.items.map((service, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold text-[#2171B5] mb-4">{service.title}</h3>
                <p className="text-gray-700">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section id="case-studies" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-[#2171B5] mb-12 text-center">{content.caseStudies.title}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {content.caseStudies.items.map((caseStudy, index) => (
              <div key={index} className="bg-[#EFF3FF] p-8 rounded-lg">
                <h3 className="text-2xl font-bold text-[#2171B5] mb-4">{caseStudy.title}</h3>
                <p className="text-gray-700">
                  {caseStudy.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-[#2171B5] text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">{content.contact.title}</h2>
          <div className="max-w-2xl mx-auto">
            <p className="text-xl mb-8 text-center">
              {content.contact.description}
            </p>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <ContactForm />
            </div>
            <div className="mt-8 flex justify-center">
              <SocialLinks />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} {content.footer.copyright}</p>
        </div>
      </footer>
    </main>
  )
}

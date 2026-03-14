'use client'
import React, { useState, useEffect } from 'react'
import content from '@/data/content.json'
import Link from 'next/link'
import Image from 'next/image'

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      
      const sections = ['solutions', 'case-studies', 'how-it-works', 'contact']
      const scrollPosition = window.scrollY + 100

      if (scrollPosition < 300) {
        setActiveSection('')
        return
      }

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId)
            return
          }
        }
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const isActive = (href: string) => {
    if (href === '/' || href === '/#' || href === '#') return activeSection === ''
    const sectionId = href.replace('/#', '').replace('#', '').replace('/', '')
    return activeSection === sectionId
  }

  return (
    <header className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-[#060b17]/90 backdrop-blur-xl border-b border-slate-700/70 shadow-2xl shadow-black/30' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="relative flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/favicon.png"
              alt="Pyow Digitals logo"
              width={48}
              height={48}
              className="h-12 w-12 object-contain"
              priority
            />
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight transition-colors text-white">PYOW</span>
              <span className="text-xs font-semibold tracking-wider transition-colors text-[#c8ff57]">DIGITALS</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-2 absolute left-1/2 -translate-x-1/2">
            {content.header.navigation.map((item, index) => {
              const href = item.href.startsWith('#') ? `/${item.href}` : item.href
              const active = isActive(item.href)
              return item.href.startsWith('/') || item.href.startsWith('#') ? (
                <Link
                  key={index}
                  href={href}
                  className={`relative px-4 py-2 font-medium tracking-[0.02em] transition-all duration-300 rounded-md ${isScrolled ? 'text-slate-400/70 hover:text-[#c8ff57]' : 'text-white/55 hover:text-[#c8ff57]'} ${active ? '!text-[#c8ff57]' : ''}`}
                >
                  {item.name}
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-300 bg-[#c8ff57] ${active ? 'w-8' : 'w-0'}`}></span>
                </Link>
              ) : (
                <a 
                  key={index}
                  href={item.href} 
                  className={`relative px-4 py-2 font-medium tracking-[0.02em] transition-all duration-300 rounded-md ${isScrolled ? 'text-slate-400/70 hover:text-[#c8ff57]' : 'text-white/55 hover:text-[#c8ff57]'} ${active ? '!text-[#c8ff57]' : ''}`}
                >
                  {item.name}
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-300 bg-[#c8ff57] ${active ? 'w-8' : 'w-0'}`}></span>
                </a>
              )
            })}
          </nav>

          <div className="hidden lg:flex items-center ml-auto">
            <a 
              href={content.header.ctaButton.href}
              className="bg-[#c8ff57] hover:bg-[#d4ff7a] text-[#0b1020] font-bold py-2.5 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-[#c8ff57]/25"
            >
              {content.header.ctaButton.text}
            </a>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button 
              className="relative w-10 h-10 flex items-center justify-center"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <div className="relative w-6 h-5">
                <span className={`absolute left-0 w-full h-0.5 transition-all duration-300 ${isScrolled ? 'bg-slate-200' : 'bg-white'} ${isMobileMenuOpen ? 'top-2 rotate-45' : 'top-0'}`}></span>
                <span className={`absolute left-0 top-2 w-full h-0.5 transition-all duration-300 ${isScrolled ? 'bg-slate-200' : 'bg-white'} ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`absolute left-0 w-full h-0.5 transition-all duration-300 ${isScrolled ? 'bg-slate-200' : 'bg-white'} ${isMobileMenuOpen ? 'top-2 -rotate-45' : 'top-4'}`}></span>
              </div>
            </button>
          </div>
        </div>

        <div className={`lg:hidden overflow-hidden transition-all duration-500 ${isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <nav className="bg-[#0a1324]/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-700/60 mb-4 overflow-hidden">
            {content.header.navigation.map((item, index) => {
              const href = item.href.startsWith('#') ? `/${item.href}` : item.href
              const active = isActive(item.href)
              return item.href.startsWith('/') || item.href.startsWith('#') ? (
                <Link
                  key={index}
                  href={href}
                  className={`block px-6 py-4 font-medium transition-all duration-300 border-b border-slate-800 last:border-b-0 ${active ? 'text-[#c8ff57] bg-slate-800/70 border-l-4 border-l-[#c8ff57]' : 'text-slate-300 hover:text-[#c8ff57] hover:bg-slate-800/55'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ) : (
                <a 
                  key={index}
                  href={item.href} 
                  className={`block px-6 py-4 font-medium transition-all duration-300 border-b border-slate-800 last:border-b-0 ${active ? 'text-[#c8ff57] bg-slate-800/70 border-l-4 border-l-[#c8ff57]' : 'text-slate-300 hover:text-[#c8ff57] hover:bg-slate-800/55'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              )
            })}
            <div className="p-4">
              <a 
                href={content.header.ctaButton.href}
                className="block text-center bg-[#c8ff57] text-[#0b1020] font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {content.header.ctaButton.text}
              </a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header

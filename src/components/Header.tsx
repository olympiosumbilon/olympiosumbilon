'use client'
import React, { useState, useEffect } from 'react'
import content from '@/data/content.json'
import Link from 'next/link'

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-2">
            <span className="bg-[#2171B5] text-white px-2.5 py-1.5 rounded font-bold text-sm">{content.header.logo}</span>
            <span className={`font-semibold text-lg ${isScrolled ? 'text-gray-900' : 'text-white'}`}>{content.header.name}</span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-6">
            {content.header.navigation.map((item, index) => (
              item.href.startsWith('/') ? (
                <Link
                  key={index}
                  href={item.href}
                  className={`font-medium transition-colors ${isScrolled ? 'text-gray-700 hover:text-[#2171B5]' : 'text-white/90 hover:text-white'}`}
                >
                  {item.name}
                </Link>
              ) : (
                <a 
                  key={index}
                  href={item.href} 
                  className={`font-medium transition-colors ${isScrolled ? 'text-gray-700 hover:text-[#2171B5]' : 'text-white/90 hover:text-white'}`}
                >
                  {item.name}
                </a>
              )
            ))}
            <a 
              href={content.header.ctaButton.href}
              className="bg-[#2171B5] hover:bg-[#08519c] text-white font-semibold py-2.5 px-6 rounded-full transition-all shadow-lg hover:shadow-xl"
            >
              {content.header.ctaButton.text}
            </a>
          </nav>

          <button 
            className="lg:hidden"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <svg className={`w-6 h-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white rounded-b-2xl shadow-xl">
            <nav className="flex flex-col py-4">
              {content.header.navigation.map((item, index) => (
                item.href.startsWith('/') ? (
                  <Link
                    key={index}
                    href={item.href}
                    className="text-gray-700 hover:text-[#2171B5] hover:bg-gray-50 px-4 py-3 font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <a 
                    key={index}
                    href={item.href} 
                    className="text-gray-700 hover:text-[#2171B5] hover:bg-gray-50 px-4 py-3 font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                )
              ))}
              <div className="px-4 pt-4">
                <a 
                  href={content.header.ctaButton.href}
                  className="block text-center bg-[#2171B5] hover:bg-[#08519c] text-white font-semibold py-3 px-6 rounded-full transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {content.header.ctaButton.text}
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header

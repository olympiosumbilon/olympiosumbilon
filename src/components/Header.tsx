'use client'
import React, { useState, useEffect } from 'react'
import content from '@/data/content.json'
import Link from 'next/link'
import Image from 'next/image'
import ThemeToggle from './ThemeToggle'

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
    <header className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center group">
            <div className="flex flex-col">
              <span className={`font-bold text-lg leading-tight transition-colors ${isScrolled ? 'text-[#2f4a8a] dark:text-[#4a6cb3]' : 'text-white'}`}>
                PYOW
              </span>
              <span className={`text-xs font-semibold tracking-wider transition-colors ${isScrolled ? 'text-[#e8a030]' : 'text-[#f0b840]'}`}>
                DIGITALS
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-1">
            {content.header.navigation.map((item, index) => (
              item.href.startsWith('/') ? (
                <Link
                  key={index}
                  href={item.href}
                  className={`relative px-4 py-2 font-medium transition-all duration-300 rounded-lg hover:bg-white/10 ${isScrolled ? 'text-gray-700 dark:text-gray-300 hover:text-[#2f4a8a] dark:hover:text-[#4a6cb3] hover:bg-[#2f4a8a]/5' : 'text-white/90 hover:text-white'}`}
                >
                  {item.name}
                </Link>
              ) : (
                <a 
                  key={index}
                  href={item.href} 
                  className={`relative px-4 py-2 font-medium transition-all duration-300 rounded-lg hover:bg-white/10 ${isScrolled ? 'text-gray-700 dark:text-gray-300 hover:text-[#2f4a8a] dark:hover:text-[#4a6cb3] hover:bg-[#2f4a8a]/5' : 'text-white/90 hover:text-white'}`}
                >
                  {item.name}
                </a>
              )
            ))}
            <ThemeToggle isScrolled={isScrolled} />
            <a 
              href={content.header.ctaButton.href}
              className="ml-2 bg-gradient-to-r from-[#2f4a8a] to-[#4a6cb3] hover:from-[#243b6e] hover:to-[#3d5a96] text-white font-semibold py-2.5 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              {content.header.ctaButton.text}
            </a>
          </nav>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle isScrolled={isScrolled} />
            <button 
              className="relative w-10 h-10 flex items-center justify-center"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <div className="relative w-6 h-5">
                <span className={`absolute left-0 w-full h-0.5 transition-all duration-300 ${isScrolled ? 'bg-gray-700 dark:bg-gray-300' : 'bg-white'} ${isMobileMenuOpen ? 'top-2 rotate-45' : 'top-0'}`}></span>
                <span className={`absolute left-0 top-2 w-full h-0.5 transition-all duration-300 ${isScrolled ? 'bg-gray-700 dark:bg-gray-300' : 'bg-white'} ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`absolute left-0 w-full h-0.5 transition-all duration-300 ${isScrolled ? 'bg-gray-700 dark:bg-gray-300' : 'bg-white'} ${isMobileMenuOpen ? 'top-2 -rotate-45' : 'top-4'}`}></span>
              </div>
            </button>
          </div>
        </div>

        <div className={`lg:hidden overflow-hidden transition-all duration-500 ${isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <nav className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-2xl shadow-xl mb-4 overflow-hidden">
            {content.header.navigation.map((item, index) => (
              item.href.startsWith('/') ? (
                <Link
                  key={index}
                  href={item.href}
                  className="block text-gray-700 dark:text-gray-300 hover:text-[#2f4a8a] dark:hover:text-[#4a6cb3] hover:bg-[#2f4a8a]/5 dark:hover:bg-[#4a6cb3]/10 px-6 py-4 font-medium transition-all duration-300 border-b border-gray-100 dark:border-slate-700 last:border-b-0"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ) : (
                <a 
                  key={index}
                  href={item.href} 
                  className="block text-gray-700 dark:text-gray-300 hover:text-[#2f4a8a] dark:hover:text-[#4a6cb3] hover:bg-[#2f4a8a]/5 dark:hover:bg-[#4a6cb3]/10 px-6 py-4 font-medium transition-all duration-300 border-b border-gray-100 dark:border-slate-700 last:border-b-0"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              )
            ))}
            <div className="p-4">
              <a 
                href={content.header.ctaButton.href}
                className="block text-center bg-gradient-to-r from-[#2f4a8a] to-[#4a6cb3] text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 shadow-lg"
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

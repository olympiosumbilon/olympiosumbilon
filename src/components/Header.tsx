'use client'
import React, { useState } from 'react'
import content from '@/data/content.json'
import Logo from './Logo'

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="fixed w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {content.header.navigation.map((item, index) => (
              <a 
                key={index}
                href={item.href} 
                className="text-gray-700 hover:text-[#2171B5] transition-colors"
              >
                {item.name}
              </a>
            ))}
            <button className="bg-[#2171B5] hover:bg-[#6BAED6] text-white font-bold py-2 px-6 rounded-full transition-colors">
              {content.header.ctaButton.text}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} bg-white shadow-lg`}>
          <nav className="flex flex-col space-y-4 py-4">
            {content.header.navigation.map((item, index) => (
              <a 
                key={index}
                href={item.href} 
                className="text-gray-700 hover:text-[#2171B5] transition-colors px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <button 
              className="bg-[#2171B5] hover:bg-[#6BAED6] text-white font-bold py-2 px-6 rounded-full transition-colors mx-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {content.header.ctaButton.text}
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header 
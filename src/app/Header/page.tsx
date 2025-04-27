'use client'
import React from 'react'

const Header = () => {
  return (
    <header className="fixed w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold text-[#2171B5]">LOGO</div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-[#2171B5] transition-colors">Home</a>
            <a href="#about" className="text-gray-700 hover:text-[#2171B5] transition-colors">About Us</a>
            <a href="#services" className="text-gray-700 hover:text-[#2171B5] transition-colors">What We Do</a>
            <a href="#case-studies" className="text-gray-700 hover:text-[#2171B5] transition-colors">Case Studies</a>
            <a href="#contact" className="text-gray-700 hover:text-[#2171B5] transition-colors">Contact</a>
            <button className="bg-[#2171B5] hover:bg-[#6BAED6] text-white font-bold py-2 px-6 rounded-full transition-colors">
              Book a Call
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header 
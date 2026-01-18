'use client'
import React, { useState } from 'react'

const FloatingContact = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      {/* Main Toggle Button */}
      <button
        onClick={toggleMenu}
        className={`flex items-center justify-center px-6 py-3 bg-[#e8a030] text-white rounded-full shadow-2xl hover:shadow-orange-500/20 hover:scale-105 transition-all duration-300 group ${isOpen ? 'rotate-90' : ''}`}
      >
        <div className="flex items-center">
          <span className={`font-bold mr-2 transition-all duration-300 ${isOpen ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>Contact Us</span>
          <div className="relative w-6 h-6">
            <svg
              className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <svg
              className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
      </button>
    </div>
  )
}

export default FloatingContact

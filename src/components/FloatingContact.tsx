'use client'
import React, { useState } from 'react'

const FloatingContact = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      {/* Pop-up buttons */}
      <div className={`flex flex-col gap-4 mb-4 transition-all duration-300 transform ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        {/* Messenger Button */}
        <a
          href="https://m.me/olympiosumbilonjr"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center group"
        >
          <span className="mr-3 px-3 py-1 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 text-sm font-semibold rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Messenger
          </span>
          <div className="w-12 h-12 bg-[#0084FF] rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.304 2.245.464 3.443.464 6.627 0 12-4.974 12-11.111C24 4.974 18.627 0 12 0zm1.291 14.194l-3.039-3.235-5.922 3.235 6.514-6.916 3.106 3.235 5.855-3.235-6.514 6.916z"/>
            </svg>
          </div>
        </a>
      </div>

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

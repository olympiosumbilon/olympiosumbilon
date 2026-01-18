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
        {/* WhatsApp Button */}
        <a
          href="https://wa.me/639357258656?text=Hi%20Pyow%20Digitals!%20I'm%20interested%20in%20your%20web%20design%20services."
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center group"
        >
          <span className="mr-3 px-3 py-1 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 text-sm font-semibold rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            WhatsApp
          </span>
          <div className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.628 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
        </a>

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

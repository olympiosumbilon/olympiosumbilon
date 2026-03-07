'use client'
import React from 'react'

const SocialLinks = () => {
  const socialLinks = [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/olympiosumbilonjr',
      icon: (
        <div className="p-2.5 rounded-md border border-slate-700 bg-[#0b1220] hover:border-[#c8ff57]/40 hover:bg-[#111a2f] transition-all duration-300 group">
          <svg className="w-5 h-5 text-slate-300 group-hover:text-[#c8ff57] transition-colors" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </div>
      )
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/olympiosumbilonjr/',
      icon: (
        <div className="p-2.5 rounded-md border border-slate-700 bg-[#0b1220] hover:border-[#c8ff57]/40 hover:bg-[#111a2f] transition-all duration-300 group">
          <svg className="w-5 h-5 text-slate-300 group-hover:text-[#c8ff57] transition-colors" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5Zm8.9 1.35a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Z"/>
          </svg>
        </div>
      )
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/olympiosumbilonjr/',
      icon: (
        <div className="p-2.5 rounded-md border border-slate-700 bg-[#0b1220] hover:border-[#c8ff57]/40 hover:bg-[#111a2f] transition-all duration-300 group">
          <svg className="w-5 h-5 text-slate-300 group-hover:text-[#c8ff57] transition-colors" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </div>
      )
    },
  ]

  return (
    <div className="flex space-x-3">
      {socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="transform hover:scale-110 transition-transform duration-300"
          aria-label={link.name}
        >
          {link.icon}
        </a>
      ))}
    </div>
  )
}

export default SocialLinks 

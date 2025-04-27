'use client'
import React from 'react'

const Logo = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        {/* Logo Background */}
        <div className="w-10 h-10 bg-[#2171B5] rounded-lg flex items-center justify-center">
          <span className="text-white text-xl font-bold">OS</span>
        </div>
        {/* Decorative Element */}
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#6BAED6] rounded-full"></div>
      </div>
      <div className="flex flex-col">
        <span className="text-[#2171B5] text-xl font-bold">Olympio</span>
        {/* <span className="text-[#6BAED6] text-sm">Developer</span> */}
      </div>
    </div>
  )
}

export default Logo 
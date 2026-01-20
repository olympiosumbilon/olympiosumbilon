'use client'
import React, { useRef, useState, useEffect, useCallback } from 'react'
import ToolIcon from './ToolIcon'

interface Tool {
  name: string
  category: string
}

interface MobileToolsSliderProps {
  tools: Tool[]
}

export default function MobileToolsSlider({ tools }: MobileToolsSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [isAutoScrolling, setIsAutoScrolling] = useState(true)
  const autoScrollRef = useRef<number | null>(null)

  const startAutoScroll = useCallback(() => {
    if (!sliderRef.current || !isAutoScrolling) return
    
    const scroll = () => {
      if (sliderRef.current && isAutoScrolling && !isDragging) {
        sliderRef.current.scrollLeft += 0.5
        
        const maxScroll = sliderRef.current.scrollWidth - sliderRef.current.clientWidth
        if (sliderRef.current.scrollLeft >= maxScroll / 2) {
          sliderRef.current.scrollLeft = 0
        }
      }
      autoScrollRef.current = requestAnimationFrame(scroll)
    }
    
    autoScrollRef.current = requestAnimationFrame(scroll)
  }, [isAutoScrolling, isDragging])

  useEffect(() => {
    startAutoScroll()
    return () => {
      if (autoScrollRef.current) {
        cancelAnimationFrame(autoScrollRef.current)
      }
    }
  }, [startAutoScroll])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return
    setIsDragging(true)
    setIsAutoScrolling(false)
    setStartX(e.pageX - sliderRef.current.offsetLeft)
    setScrollLeft(sliderRef.current.scrollLeft)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setTimeout(() => setIsAutoScrolling(true), 3000)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return
    e.preventDefault()
    const x = e.pageX - sliderRef.current.offsetLeft
    const walk = (x - startX) * 2
    sliderRef.current.scrollLeft = scrollLeft - walk
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!sliderRef.current) return
    setIsDragging(true)
    setIsAutoScrolling(false)
    setStartX(e.touches[0].pageX - sliderRef.current.offsetLeft)
    setScrollLeft(sliderRef.current.scrollLeft)
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    setTimeout(() => setIsAutoScrolling(true), 3000)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !sliderRef.current) return
    const x = e.touches[0].pageX - sliderRef.current.offsetLeft
    const walk = (x - startX) * 2
    sliderRef.current.scrollLeft = scrollLeft - walk
  }

  const duplicatedTools = [...tools, ...tools]

  return (
    <div className="relative">
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#F8FAFC] dark:from-slate-800 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#F8FAFC] dark:from-slate-800 to-transparent z-10 pointer-events-none"></div>
      <div
        ref={sliderRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing select-none py-2"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        style={{ scrollBehavior: isDragging ? 'auto' : 'smooth' }}
      >
        {duplicatedTools.map((tool, index) => (
          <div key={index} className="flex-shrink-0">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl px-5 py-4 min-w-[140px] text-center transition-all duration-300 border border-gray-100 dark:border-slate-700 group">
              <div className="w-10 h-10 mx-auto mb-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ToolIcon name={tool.name} className="w-8 h-8" />
              </div>
              <div className="font-bold text-gray-900 dark:text-white text-xs">{tool.name}</div>
              <div className="text-[10px] text-[#2f4a8a] dark:text-[#4a6cb3] font-medium">{tool.category}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

'use client'
import React, { useRef, useEffect } from 'react'
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
  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const slider = sliderRef.current
    if (!slider) return

    let animationId: number

    const autoScroll = () => {
      if (!isDraggingRef.current && slider) {
        slider.scrollLeft += 0.8
        
        const maxScroll = slider.scrollWidth - slider.clientWidth
        if (slider.scrollLeft >= maxScroll / 2) {
          slider.scrollLeft = 0
        }
      }
      animationId = requestAnimationFrame(autoScroll)
    }

    animationId = requestAnimationFrame(autoScroll)

    return () => {
      cancelAnimationFrame(animationId)
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current)
      }
    }
  }, [])

  const handleStart = (clientX: number) => {
    if (!sliderRef.current) return
    isDraggingRef.current = true
    startXRef.current = clientX - sliderRef.current.offsetLeft
    scrollLeftRef.current = sliderRef.current.scrollLeft
    
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current)
    }
  }

  const handleEnd = () => {
    isDraggingRef.current = false
  }

  const handleMove = (clientX: number) => {
    if (!isDraggingRef.current || !sliderRef.current) return
    const x = clientX - sliderRef.current.offsetLeft
    const walk = (x - startXRef.current) * 1.5
    sliderRef.current.scrollLeft = scrollLeftRef.current - walk
  }

  const handleMouseDown = (e: React.MouseEvent) => handleStart(e.pageX)
  const handleMouseUp = () => handleEnd()
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingRef.current) e.preventDefault()
    handleMove(e.pageX)
  }

  const handleTouchStart = (e: React.TouchEvent) => handleStart(e.touches[0].pageX)
  const handleTouchEnd = () => handleEnd()
  const handleTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].pageX)

  const duplicatedTools = [...tools, ...tools, ...tools]

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

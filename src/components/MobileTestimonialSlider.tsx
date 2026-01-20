'use client'
import React, { useRef, useEffect } from 'react'

interface Testimonial {
  name: string
  role: string
  content: string
}

interface MobileTestimonialSliderProps {
  testimonials: Testimonial[]
}

export default function MobileTestimonialSlider({ testimonials }: MobileTestimonialSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)

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
    }
  }, [])

  const handleStart = (clientX: number) => {
    if (!sliderRef.current) return
    isDraggingRef.current = true
    startXRef.current = clientX - sliderRef.current.offsetLeft
    scrollLeftRef.current = sliderRef.current.scrollLeft
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

  const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials]

  return (
    <div className="relative">
      <div
        ref={sliderRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
      >
        {duplicatedTestimonials.map((testimonial, index) => (
          <div key={index} className="flex-shrink-0 w-[85vw] max-w-[320px]">
            <div className="card h-full border border-gray-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-[#e8a030] fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic mb-6 leading-relaxed text-sm">
                "{testimonial.content}"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-[#2f4a8a] rounded-full flex items-center justify-center text-white font-bold mr-3">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm leading-tight">{testimonial.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-2 mt-4 text-gray-500 dark:text-gray-400 text-sm">
        <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
        </svg>
        <span>Swipe to see more ({testimonials.length} reviews)</span>
        <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </div>
  )
}

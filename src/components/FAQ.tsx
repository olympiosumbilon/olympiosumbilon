'use client'
import React, { useState, useEffect, useRef } from 'react'

interface FAQItem {
  question: string
  answer: string
}

interface FAQProps {
  items: FAQItem[]
}

const FAQ = ({ items }: FAQProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(items.length).fill(false))
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    itemRefs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setTimeout(() => {
                  setVisibleItems(prev => {
                    const newState = [...prev]
                    newState[index] = true
                    return newState
                  })
                }, index * 100)
              } else {
                setVisibleItems(prev => {
                  const newState = [...prev]
                  newState[index] = false
                  return newState
                })
              }
            })
          },
          { threshold: 0.1 }
        )
        observer.observe(ref)
        observers.push(observer)
      }
    })

    return () => observers.forEach(observer => observer.disconnect())
  }, [items.length])

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={index}
          ref={(el) => { itemRefs.current[index] = el }}
          style={{
            opacity: visibleItems[index] ? 1 : 0,
            transform: visibleItems[index] ? 'translateY(0)' : 'translateY(30px)',
            transition: `opacity 0.5s ease-out, transform 0.5s ease-out`,
          }}
          className={`bg-white dark:bg-slate-800 rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:border-slate-700 
            hover:shadow-xl hover:scale-[1.02] hover:border-[#2f4a8a]/30 dark:hover:border-[#4a6cb3]/30
            transition-all duration-300 cursor-pointer group`}
        >
          <button
            onClick={() => toggleItem(index)}
            className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
          >
            <span className={`font-semibold pr-4 transition-colors duration-300 ${
              openIndex === index 
                ? 'text-[#2f4a8a] dark:text-[#4a6cb3]' 
                : 'text-gray-900 dark:text-white group-hover:text-[#2f4a8a] dark:group-hover:text-[#4a6cb3]'
            }`}>
              {item.question}
            </span>
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              openIndex === index 
                ? 'bg-[#e8a030] rotate-180 scale-110' 
                : 'bg-gray-100 dark:bg-slate-700 group-hover:bg-[#2f4a8a]/10 dark:group-hover:bg-[#4a6cb3]/20'
            }`}>
              <svg
                className={`w-4 h-4 transition-all duration-300 ${
                  openIndex === index 
                    ? 'text-white' 
                    : 'text-gray-600 dark:text-gray-400 group-hover:text-[#2f4a8a] dark:group-hover:text-[#4a6cb3]'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="px-6 pb-5 text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-slate-700 pt-4">
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default FAQ

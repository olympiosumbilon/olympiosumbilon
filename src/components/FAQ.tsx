'use client'
import React, { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

interface FAQProps {
  items: FAQItem[]
}

const FAQ = ({ items }: FAQProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 dark:border-slate-700"
        >
          <button
            onClick={() => toggleItem(index)}
            className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none group"
          >
            <span className="font-semibold text-gray-900 dark:text-white pr-4 group-hover:text-[#2f4a8a] dark:group-hover:text-[#4a6cb3] transition-colors">
              {item.question}
            </span>
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${openIndex === index ? 'bg-[#e8a030] rotate-180' : 'bg-gray-100 dark:bg-slate-700'}`}>
              <svg
                className={`w-4 h-4 transition-colors ${openIndex === index ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="px-6 pb-5 text-gray-600 dark:text-gray-400 leading-relaxed">
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default FAQ

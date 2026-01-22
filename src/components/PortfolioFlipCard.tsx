'use client'
import { useState } from 'react'
import Image from 'next/image'

interface Project {
  title: string
  category: string
  description: string
  image: string
  client?: string
  year?: string
  technologies?: string[]
  features?: string[]
  fullDescription?: string
  url?: string
}

interface PortfolioFlipCardProps {
  project: Project
}

export default function PortfolioFlipCard({ project }: PortfolioFlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div 
      className="perspective-1000 h-[380px] sm:h-[400px] md:h-[420px] cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div 
        className={`relative w-full h-full transition-transform duration-700 preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front Side */}
        <div className="absolute inset-0 backface-hidden">
          <div className="interactive-card card overflow-hidden p-0 group border border-gray-100 dark:border-slate-700 h-full flex flex-col rounded-xl">
            <div className="h-[45%] sm:h-[50%] bg-gradient-to-br from-[#2f4a8a] to-[#4a6cb3] flex items-center justify-center relative overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 bg-[#e8a030]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {project.image ? (
                <Image 
                  src={project.image} 
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <span className="text-white/50 text-sm group-hover:scale-110 transition-transform duration-300">Project Image</span>
              )}
            </div>
            <div className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col min-h-0">
              <span className="inline-block bg-[#2f4a8a]/10 dark:bg-[#4a6cb3]/20 text-[#2f4a8a] dark:text-[#4a6cb3] px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-2 sm:mb-3 w-fit">
                {project.category}
              </span>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 group-hover:text-[#2f4a8a] dark:group-hover:text-[#4a6cb3] transition-colors line-clamp-2">{project.title}</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 flex-1 line-clamp-2 sm:line-clamp-3">{project.description}</p>
              <div className="mt-2 sm:mt-3 flex items-center text-xs sm:text-sm text-[#e8a030] font-medium">
                <span>Click to see details</span>
                <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <div className="card overflow-hidden p-0 border border-gray-100 dark:border-slate-700 h-full bg-gradient-to-br from-[#2f4a8a] to-[#4a6cb3] text-white rounded-xl">
            <div className="p-4 sm:p-5 md:p-6 h-full flex flex-col">
              {/* Header - Fixed */}
              <div className="flex items-center justify-between mb-3 flex-shrink-0">
                <span className="inline-block bg-white/20 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                  {project.category}
                </span>
                {project.year && (
                  <span className="text-white/70 text-xs sm:text-sm">{project.year}</span>
                )}
              </div>
              
              <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 flex-shrink-0 line-clamp-2">{project.title}</h3>
              
              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto min-h-0 pr-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                {project.client && (
                  <p className="text-white/80 text-xs sm:text-sm mb-3">
                    <span className="text-[#f0b840]">Client:</span> {project.client}
                  </p>
                )}

                {/* Full Description for long content */}
                {project.fullDescription && (
                  <div className="mb-3">
                    <p className="text-[#f0b840] text-xs sm:text-sm font-medium mb-1">About</p>
                    <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
                      {project.fullDescription}
                    </p>
                  </div>
                )}

                {project.technologies && project.technologies.length > 0 && (
                  <div className="mb-3">
                    <p className="text-[#f0b840] text-xs sm:text-sm font-medium mb-1 sm:mb-2">Technologies</p>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {project.technologies.map((tech, i) => (
                        <span key={i} className="bg-white/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {project.features && project.features.length > 0 && (
                  <div className="mb-2">
                    <p className="text-[#f0b840] text-xs sm:text-sm font-medium mb-1 sm:mb-2">Key Features</p>
                    <ul className="space-y-1">
                      {project.features.map((feature, i) => (
                        <li key={i} className="text-white/80 text-xs sm:text-sm flex items-start">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#f0b840] mr-1 sm:mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="flex-1">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Footer - Fixed */}
              <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-white/10 flex items-center justify-between flex-shrink-0">
                <span className="text-white/60 text-[10px] sm:text-xs flex items-center">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                  Tap to flip
                </span>
                {project.url && project.url !== '#' && (
                  <a 
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#f0b840] text-[#2f4a8a] px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-[#e8a030] transition-colors"
                  >
                    View Project
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

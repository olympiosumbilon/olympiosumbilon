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
  url?: string
}

interface PortfolioFlipCardProps {
  project: Project
}

export default function PortfolioFlipCard({ project }: PortfolioFlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div 
      className="perspective-1000 h-[400px] cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div 
        className={`relative w-full h-full transition-transform duration-700 preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front Side */}
        <div className="absolute inset-0 backface-hidden">
          <div className="interactive-card card overflow-hidden p-0 group border border-gray-100 dark:border-slate-700 h-full flex flex-col">
            <div className="aspect-[16/10] bg-gradient-to-br from-[#2f4a8a] to-[#4a6cb3] flex items-center justify-center relative overflow-hidden flex-shrink-0">
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
            <div className="p-6 flex-1 flex flex-col">
              <span className="inline-block bg-[#2f4a8a]/10 dark:bg-[#4a6cb3]/20 text-[#2f4a8a] dark:text-[#4a6cb3] px-3 py-1 rounded-full text-sm font-medium mb-3 w-fit">
                {project.category}
              </span>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-[#2f4a8a] dark:group-hover:text-[#4a6cb3] transition-colors">{project.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 flex-1">{project.description}</p>
              <div className="mt-4 flex items-center text-sm text-[#e8a030] font-medium">
                <span>Click to see details</span>
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <div className="card overflow-hidden p-0 border border-gray-100 dark:border-slate-700 h-full bg-gradient-to-br from-[#2f4a8a] to-[#4a6cb3] text-white">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                  {project.category}
                </span>
                {project.year && (
                  <span className="text-white/70 text-sm">{project.year}</span>
                )}
              </div>
              
              <h3 className="text-xl font-bold mb-2">{project.title}</h3>
              
              {project.client && (
                <p className="text-white/80 text-sm mb-4">
                  <span className="text-[#f0b840]">Client:</span> {project.client}
                </p>
              )}

              {project.technologies && project.technologies.length > 0 && (
                <div className="mb-4">
                  <p className="text-[#f0b840] text-sm font-medium mb-2">Technologies</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="bg-white/10 px-2 py-1 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {project.features && project.features.length > 0 && (
                <div className="flex-1">
                  <p className="text-[#f0b840] text-sm font-medium mb-2">Key Features</p>
                  <ul className="space-y-1">
                    {project.features.slice(0, 4).map((feature, i) => (
                      <li key={i} className="text-white/80 text-sm flex items-start">
                        <svg className="w-4 h-4 text-[#f0b840] mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-auto pt-4 flex items-center justify-between">
                <span className="text-white/60 text-sm flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                  Click to flip back
                </span>
                {project.url && project.url !== '#' && (
                  <a 
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#f0b840] text-[#2f4a8a] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#e8a030] transition-colors"
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

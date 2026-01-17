# Pyow Digitals - Portfolio & Sales Page

## Overview
A professional portfolio and sales-focused landing page for Pyow Digitals, built with Next.js, React, TypeScript, and Tailwind CSS. The site showcases web design and development services, attracts potential clients, and converts visitors into leads.

## Tech Stack
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Contact Form**: Nodemailer (API route at `/api/contact`)

## Brand Colors
- **Primary Blue**: #2f4a8a (deep blue)
- **Primary Light**: #4a6cb3 (lighter blue)
- **Accent Gold**: #e8a030 (gold/orange accent)
- **Accent Light**: #f0b840 (lighter gold)

## Project Structure
```
src/
├── app/
│   ├── page.tsx          # Main landing page
│   ├── layout.tsx        # Root layout
│   ├── globals.css       # Global styles & utility classes
│   ├── blog/
│   │   └── page.tsx      # Blog listing page
│   └── api/
│       └── contact/
│           └── route.ts  # Contact form API
├── components/
│   ├── Header.tsx        # Navigation header
│   ├── ContactForm.tsx   # Contact form component
│   ├── SocialLinks.tsx   # Social media links
│   └── Logo.tsx          # Logo component
├── data/
│   └── content.json      # All site content (easily editable)
└── images/
    └── me.jpg            # Profile photo
```

## Key Features
- **Hero Section**: Sales-focused headline with stats and CTAs
- **Services**: Web Design & Web Development offerings
- **Tools Carousel**: Animated showcase of tech stack
- **Pricing**: Three-tier pricing (Free, Basic, Advanced)
- **Portfolio**: Filterable project gallery by category (UI/UX, Framer, WordPress, GoHighLevel, Programming)
- **Testimonials**: Client feedback section
- **Blog**: Blog page with post previews
- **Contact**: Contact form with email integration
- **Footer**: Links and copyright

## Running the Project
```bash
npm install
npm run dev -- -p 5000 -H 0.0.0.0
```

## Deployment
The project is configured for Replit's autoscale deployment:
- Build: `npm run build`
- Start: `npm run start -- -p 5000 -H 0.0.0.0`

## Content Management
All text content is stored in `src/data/content.json` for easy updates without touching code. This includes:
- Navigation links
- Hero text and stats
- Services descriptions
- Tools list
- Pricing tiers and features
- Portfolio projects
- Testimonials
- Blog posts
- Footer links

## Recent Changes
- **January 2026**: Complete redesign from simple portfolio to sales-focused landing page
  - Added tools carousel with animation
  - Added three-tier pricing section
  - Added filterable portfolio gallery
  - Added testimonials section
  - Created dedicated blog page
  - Modernized header with scroll effect
  - Improved responsive design

## User Preferences
- Pyow Digitals branding (Blue #2f4a8a + Gold #e8a030)
- Clean, modern UI design with interactive elements
- Sales-oriented copywriting
- Mobile-first approach
- Glass morphism effects and smooth animations

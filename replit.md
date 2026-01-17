# Personal Brand Website

## Overview
A personal brand/portfolio website built with Next.js 14, React 18, TypeScript, and Tailwind CSS. Features a contact form using nodemailer for email functionality.

## Project Structure
- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - React components (Header, Logo, ContactForm, SocialLinks)
- `src/data/` - Content data (content.json)
- `src/images/` - Source images
- `public/` - Static assets

## Development
- Dev server runs on port 5000 with `npm run dev -- -p 5000 -H 0.0.0.0`
- Uses Tailwind CSS for styling
- TypeScript for type safety

## Deployment
- Build: `npm run build`
- Production: `npm run start -- -p 5000 -H 0.0.0.0`
- Configured for autoscale deployment

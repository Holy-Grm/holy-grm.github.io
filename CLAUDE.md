# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based portfolio website built with Vite, featuring a modern design system using Radix UI and Tailwind CSS. The project uses a mixed JavaScript/TypeScript approach with main components in JSX and UI components in TypeScript.

## Development Commands

- **Start development server**: `npm run dev` (runs on port 3000, opens automatically)
- **Build for production**: `npm run build` (outputs to `dist/` directory)
- **Preview production build**: `npm run preview`
- **Install dependencies**: `npm install`

## Architecture

### Component Structure
- **Entry Point**: `src/main.tsx` - Application entry point with React 18 createRoot and React Router
- **Main App**: `src/App.jsx` - Portfolio homepage component importing all sections
- **Routing**: Uses HashRouter with routes:
  - `/` - Main portfolio page (App component)
  - `/autovisu` - AutoVisuPage component
  - `*` - NotFoundPage (404 handler)
- **Page Sections**: Portfolio components are organized as single-page sections:
  - Header (navigation with smooth scrolling)
  - Hero (landing section)
  - About (about section)
  - Skills (skills showcase)
  - Projects (project portfolio)
  - Awards (awards/achievements section)
  - Hobbies (hobbies section)
  - Contact (contact form/info)
  - Footer (footer section)

### UI System
- **Design System**: Uses Radix UI primitives with shadcn/ui components
- **Component Library**: Located in `src/components/ui/` with TypeScript definitions
- **Styling**: Tailwind CSS with custom design tokens
- **Icons**: Lucide React for consistent iconography
- **Special Components**:
  - Timeline component in `src/components/ui/timeline.jsx`
  - ImageWithFallback in `src/components/figma/ImageWithFallback.tsx` for graceful image loading

### File Extensions
- Main components: `.jsx` 
- UI components: `.tsx` (TypeScript)
- Entry point: `.tsx` (main.tsx)
- Configuration: `.ts` for config files

### Key Dependencies
- React 18.3.1 with React DOM
- React Router DOM 7.9.0 with HashRouter for client-side routing
- Vite 6.3.5 with SWC plugin for fast builds
- Comprehensive Radix UI component suite (accordion, dialog, dropdown, etc.)
- Tailwind utilities (clsx, tailwind-merge, class-variance-authority)
- Additional UI libraries: recharts, embla-carousel-react, react-hook-form
- Theme support: next-themes
- Asset handling: ImageWithFallback component for Figma images

## Development Notes

- Uses Vite with SWC (@vitejs/plugin-react-swc) for fast builds and hot reload
- Path aliases configured with `@` pointing to `src/`
- Components use smooth scrolling navigation between sections via scrollIntoView
- Mobile-responsive design with collapsible Header navigation
- Portfolio images stored in `src/img/` directory
- **Language**: Portfolio content is in French (navigation, buttons, section titles)

## Build Configuration

- Target: ESNext
- Output directory: `dist/`
- Development server: Port 3000 with auto-open
- Base path: "/" (configured for holy-grm.github.io deployment)
- Supports both TypeScript and JavaScript files
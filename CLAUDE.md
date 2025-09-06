# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based portfolio website built with Vite and TypeScript, featuring a modern design system using Radix UI and Tailwind CSS. The project is transitioning from TypeScript to JavaScript for main components (JSX files in components/).

## Development Commands

- **Start development server**: `npm run dev` (runs on port 3000, opens automatically)
- **Build for production**: `npm run build` (outputs to `build/` directory)
- **Install dependencies**: `npm i`

## Architecture

### Component Structure
- **Main App**: `src/App.tsx` - Main application component importing all sections
- **Page Sections**: Components are organized as single-page sections:
  - Header (navigation with smooth scrolling)
  - Hero (landing section)
  - About (about section)
  - Skills (skills showcase)
  - Projects (project portfolio)
  - Contact (contact form/info)
  - Footer (footer section)

### UI System
- **Design System**: Uses Radix UI primitives with shadcn/ui components
- **Component Library**: Located in `src/components/ui/` with TypeScript definitions
- **Styling**: Tailwind CSS with custom design tokens and dark mode support
- **Icons**: Lucide React for consistent iconography

### File Extensions
- Main components: `.jsx` (transitioning from `.tsx`)
- UI components: `.tsx` (TypeScript)
- Configuration: `.ts` for config files

### Key Dependencies
- React 18.3.1 with React DOM
- Vite 6.3.5 for build tooling
- Radix UI components for accessible primitives
- Tailwind utilities (clsx, tailwind-merge, class-variance-authority)
- Recharts for data visualization
- Next-themes for theme switching

## Development Notes

- Uses Vite with SWC for fast builds and hot reload
- Path aliases configured with `@` pointing to `src/`
- All Radix UI dependencies have version-specific aliases in vite.config.ts
- Components use smooth scrolling navigation between sections
- Mobile-responsive design with collapsible navigation

## Build Configuration

- Target: ESNext
- Output directory: `build/`
- Development server: Port 3000 with auto-open
- Supports both TypeScript and JavaScript files
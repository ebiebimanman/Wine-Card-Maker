# Wine Card Generator

## Overview

A wine card generator web application that allows users to create elegant, shareable wine tasting cards through an 11-step wizard interface. Users progress through steps for: image upload → wine name → wine type → variety → origin → location → price → rating → food pairings → comments → preview. Cards can be exported as images for sharing.

### Wizard Flow (11 Steps)
1. **Image Upload** (optional) - Upload wine bottle photo with background removal option
2. **Wine Name** (required) - Autocomplete with Japanese flick input support
3. **Wine Type** - Red/White/Rose/Other selector
4. **Variety** (optional) - Grape variety with autocomplete
5. **Origin** (optional) - Wine region with autocomplete (100+ regions)
6. **Location** (optional) - Purchase location with localStorage history
7. **Price** (optional) - Price slider (500-30,000 yen)
8. **Rating** (required) - Star rating (1-5)
9. **Food Pairings** (optional) - Multi-select buttons
10. **Comments** (optional) - Multi-select comment buttons
11. **Preview** - Final card preview with save/export options

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, React Hook Form for form state
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style variant)
- **Animations**: Framer Motion for transitions and interactive effects
- **Image Export**: html-to-image library for card-to-PNG conversion

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (ESM modules)
- **API Structure**: RESTful endpoints defined in `shared/routes.ts` with Zod validation
- **Current Storage**: In-memory storage (`MemStorage` class) - designed for easy PostgreSQL migration

### Build System
- **Frontend Bundler**: Vite with React plugin
- **Backend Bundler**: esbuild for production builds
- **Development**: Hot module replacement via Vite dev server with Express middleware integration

### Shared Code Pattern
The `shared/` directory contains code used by both frontend and backend:
- `schema.ts`: Drizzle ORM table definitions and Zod validation schemas
- `routes.ts`: Type-safe API route definitions with input/output schemas

### Database Design
Schema defined with Drizzle ORM (PostgreSQL dialect):
- `wine_cards` table: stores wine information including name, origin, variety, ratings, comments, theme color, and optional base64 image

### Path Aliases
- `@/*` → `./client/src/*`
- `@shared/*` → `./shared/*`
- `@assets/*` → `./attached_assets/*`

## External Dependencies

### Database
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Connection**: Uses `DATABASE_URL` environment variable
- **Migrations**: Drizzle Kit for schema management (`db:push` command)

### UI Component Library
- **shadcn/ui**: Pre-built accessible components based on Radix UI primitives
- **Radix UI**: Low-level UI primitives (dialogs, tooltips, forms, etc.)

### Font Services
- Google Fonts: Great Vibes (script), Playfair Display (display), Shippori Mincho (body), DM Sans, Fira Code

### Deployment
- **Platform**: Configured for Vercel deployment via `vercel.json`
- **Serverless**: Express app wrapped as Vercel serverless function in `api/index.ts`
- **Static Assets**: Built to `dist/public` directory
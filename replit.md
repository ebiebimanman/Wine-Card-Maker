# Wine Card Generator

## Overview

A wine card generator web application that allows users to create elegant, shareable wine tasting cards. Users can input wine details (name, origin, variety, location, price), add food pairings, rate wines, and generate visually appealing cards with red or white wine themes. The cards can be exported as images for sharing.

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
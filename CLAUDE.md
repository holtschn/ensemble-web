# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a brass ensemble website built with Next.js 15, React 19, PayloadCMS 3, and PostgreSQL. The site features:
- Public-facing website with pages managed through PayloadCMS
- Internal "Notendatenbank" (NDB) system for managing sheet music scores for authenticated users
- Vercel Blob Storage for media files
- Email integration via Nodemailer

### Current Migration Status

**Active Migration:** We are currently migrating the Notendatenbank (scores database) frontend from a legacy implementation into the Next.js setup.

- **Reference Code:** The original implementation is preserved in the `old.gui/` directory for reference purposes
- **DO NOT modify anything in `old.gui/`** - this directory is read-only and serves as a reference for understanding the legacy system
- **New Implementation:** All new NDB code lives in `src/next/ndb/` and `src/app/(pages)/intern/ndb/`
- **Migration Approach:** The new implementation modernizes the UI/UX while maintaining compatibility with the existing external NDB API backend

## Development Commands

```bash
# Development
npm run dev              # Start development server
npm run devsafe          # Remove .next cache and start dev server

# Building & Production
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format with Prettier

# Testing
npm test                 # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
npm run test:ci          # Run tests in CI mode
npm run test:ndb         # Run NDB-specific tests
npm run test:ndb:watch   # Run NDB tests in watch mode
npm run test:utils       # Run utility tests
npm run test:verbose     # Run tests with verbose output

# PayloadCMS
npm run payload          # Access Payload CLI
npm run generate:types   # Generate TypeScript types from Payload config
npm run generate:importmap  # Generate import map
npm run generate:graphql # Generate GraphQL schema
```

## Architecture Overview

### Directory Structure

```
src/
├── app/                          # Next.js 15 App Router
│   ├── (pages)/                  # Public pages group
│   │   ├── [slug]/              # Dynamic page routes from Payload
│   │   ├── intern/              # Protected internal pages
│   │   │   ├── ndb/            # Notendatenbank (sheet music database)
│   │   │   │   ├── [id]/       # Individual score detail pages
│   │   │   │   └── components/ # NDB-specific page components
│   │   │   └── events/         # Events management
│   │   └── api/                 # API routes
│   └── (payload)/               # Payload admin panel group
│       └── admin/               # Payload admin UI
│
├── next/                         # Next.js-specific code
│   ├── auth/                    # Authentication context and hooks
│   ├── animation/               # Animation utilities
│   ├── ndb/                     # Notendatenbank module (see below)
│   ├── components/              # Shared React components
│   ├── richtext/                # Rich text rendering
│   └── utils/                   # Utility functions
│
└── payload/                      # PayloadCMS configuration
    ├── collections/             # Payload collections (Users, Media, Pages, Events)
    ├── globals/                 # Global configs (Settings, Header, Footer)
    └── components/              # Custom admin UI components
```

### Notendatenbank (NDB) Module

The NDB system (`src/next/ndb/`) is a complete sheet music management system with its own architecture:

```
src/next/ndb/
├── api/
│   ├── client.ts        # Client-side API wrapper (GET, POST, PUT)
│   ├── proxy.ts         # Server-side proxy to external NDB API with Basic Auth
│   └── actions.ts       # Next.js Server Actions for NDB operations
├── components/          # Reusable UI components (Table, Button, TextField, etc.)
│   └── scores/         # Score-specific components (ScoresTable, ScoreDetailsCard, etc.)
├── hooks/              # Custom React hooks (useScores, useFileUpDownLoad, etc.)
├── utils/              # Utility functions
├── types.ts            # TypeScript type definitions for score data
└── constants.ts        # Configuration constants (genres, difficulties, endpoints)
```

**NDB Architecture Pattern:**
- API requests flow: Client → `/api/ndb/*` (Next.js API routes) → External NDB API (via proxy.ts with Basic Auth)
- All external API calls use server-side proxy to hide credentials
- Client-side uses `ndbApi.get/post/put()` from `client.ts` which hits internal `/api/ndb/` routes
- Server Actions in `actions.ts` for server-side operations
- Custom hooks manage state and data fetching
- Constants in `constants.ts` define choices, labels, and configuration

### PayloadCMS Integration

**Collections:**
- `Users` - User authentication and authorization
- `Media` - File uploads (stored in Vercel Blob Storage)
- `Pages` - Dynamic page content
- `Events` - Event management

**Globals:**
- `Settings` - Site-wide settings
- `Header` - Navigation configuration
- `Footer` - Footer configuration

**Key Files:**
- `src/payload.config.ts` - Main Payload configuration
- `src/payload-types.ts` - Auto-generated TypeScript types (DO NOT edit manually)

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Storage
BLOB_READ_WRITE_TOKEN=           # Vercel Blob Storage token

# Database
POSTGRES_URL=                     # PostgreSQL connection string
POSTGRES_SCHEMA=                  # Schema name

# PayloadCMS
PAYLOAD_SECRET=                   # Secret for Payload
PAYLOAD_COOKIE_TOKEN_NAME=        # Cookie name for auth token

# Email
NODEMAILER_HOST=                  # SMTP host
NODEMAILER_USER=                  # SMTP user
NODEMAILER_PASS=                  # SMTP password
NODEMAILER_SENDER=                # From name

# NDB (Notendatenbank)
NDB_API_URL=                      # External NDB API base URL
NDB_USERNAME=                     # NDB API username (for Basic Auth)
NDB_PASSWORD=                     # NDB API password (for Basic Auth)
NEXT_PUBLIC_NOTENDATENBANK_LINK=  # Public link to NDB system

# Next.js
NEXT_PUBLIC_LOCAL_SERVER_URL_OVERRIDE=  # Override server URL for local dev
NEXT_REVALIDATION_KEY=            # Key for on-demand revalidation
NEXT_DRAFT_SECRET=                # Secret for draft mode
```

## Key Technical Patterns

### Path Aliases
- `@/*` maps to `src/*`
- `@payload-config` maps to `src/payload.config.ts`

### Authentication
- Authentication context in `src/next/auth/context.tsx`
- Protected routes check user authentication via `loggedInHook.tsx`
- PayloadCMS handles user management and sessions

### NDB API Pattern
External API communication follows this pattern:
1. Client calls `ndbApi.get('/scores')` from `client.ts`
2. Request goes to Next.js API route at `/api/ndb/scores`
3. API route uses functions from `proxy.ts` to call external NDB API with Basic Auth
4. Response flows back through the chain

### Testing
- Jest with ts-jest for TypeScript
- Focus on testing `src/next/ndb/**` modules
- Test files: `*.test.ts` or `*.spec.ts` or in `__tests__/` directories
- Run NDB-specific tests: `npm run test:ndb`
- Single test file: `jest path/to/file.test.ts`

### Styling
- TailwindCSS 4.0 for styling
- Global styles in `src/app/(pages)/globals.css`
- Component-level Tailwind classes

## Important Notes

- PayloadCMS admin accessible at `/admin` after starting dev server
- Generated types (`payload-types.ts`) should not be edited manually - regenerate with `npm run generate:types`
- NDB system requires authentication - users must be logged in to access `/intern/ndb/*` routes
- Media files stored in Vercel Blob Storage (configured via `@payloadcms/storage-vercel-blob` plugin)
- The project uses Next.js 15 App Router (not Pages Router)
- React Server Components are used where possible; use `'use client'` directive when needed

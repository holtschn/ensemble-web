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
- **Jest 30.2.0** with ts-jest for TypeScript, jsdom environment for React components
- **MSW 2.11.3** for API mocking at the network level
- **React Testing Library 16.3.0** for component testing
- **@testing-library/jest-dom 6.9.1** for DOM matchers
- Mock data and handlers: `src/next/ndb/__mocks__/`
- Test utilities: `src/next/ndb/__tests__/testUtils.tsx`
- Focus on testing `src/next/ndb/**` modules
- Test files: `*.test.ts` or `*.spec.ts` or in `__tests__/` directories
- Run NDB-specific tests: `npm run test:ndb`
- Single test file: `jest path/to/file.test.ts`
- **Current status:** 7 test suites, 103 tests, all passing

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

---

# Development Roadmap & Key Decisions

## User Preferences & Decisions

### Setlist Architecture
- **Storage:** Setlists reside EXCLUSIVELY in NDB API (not in Payload collections)
- **Payload Integration:** Setlist component as Payload Block with single parameter: setlistId
- **Block Modes:** Both view (read-only) and edit (full editor with allocations) in block
- **Event Linking:** Soft link via setlistId field on Event (no formal relationship)

### User Preferences Storage
- **Primary Storage:** Payload Preferences API (syncs across devices, persists in database)
- **Cache Layer:** localStorage for fast reads and fallback
- **Keys:** `ndb_column_preferences`, `ndb_active_filters`
- **Flow:** Load from Payload → cache to localStorage → immediate localStorage updates + async Payload saves

### Navigation Architecture
- **Style:** Sidebar (not dropdown menu)
- **Scope:** Unified across internal pages AND Payload admin
- **Structure:**
  - Übersicht (/intern)
  - Notendatenbank
    - Noten (/intern/ndb)
    - Setlists (/intern/ndb/setlists)
  - Adressliste (/intern/players)
  - Verwaltung (admin only)
    - Events
    - Seiten
    - Nutzer
    - Einstellungen

### Payload Block Priority
1. **SetlistBlock** (High Priority) - View + edit modes, parameter: setlistId
2. **AddressListBlock** (Medium Priority) - Filtered address lists
3. **ScoreDetailBlock** (Low Priority) - Individual score display

### Other Decisions
- **Event Wizard:** Low priority, end of roadmap
- **Search:** Always client-side (instant, no debouncing needed)
- **Filters:** Already exist ("mit Schlagzeug", "hat Partitur", "zurücksetzen" button)
- **API Caching:** TanStack Query approach (requires approval before implementation)
- **Working Model:** Kanban-style (no sprints/releases, work one item at a time)

---

## Current Status (Updated: 2025-10-07)

### ✅ Completed Features

**Phase 1: Infrastructure Foundation - COMPLETE**
- ✅ **INFRA-1:** Toast Notification System (sonner 2.0.7)
  - `ToastProvider` component created and integrated
  - Already in use across NDB pages and hooks
  - Documentation in `docs/infrastructure-usage.md`
- ✅ **INFRA-4:** EmptyState component with variants (no-results, no-data, error-state)
- ✅ **INFRA-5:** User Preferences System with Payload API + localStorage hybrid storage
  - `useUserPreference` hook created
  - `preferences.ts` utility functions
  - Handles logged-out users with localStorage fallback

**Phase 2: Advanced Table Filtering - COMPLETE**
- ✅ **TABLE-1:** Column Configuration System
  - `ColumnConfig` interface and types
  - Payload Preferences storage (`ndb_column_preferences`)
  - `ColumnSettingsModal` with drag-and-drop reordering
  - Dynamic column visibility and ordering
  - Graceful mobile degradation

- ✅ **TABLE-2:** Column-Based Filtering - Core (COMPLETE with all improvements)
  - Filter icons in all column headers
  - `FilterPopover` component with auto-positioning (fixed positioning, flips upward when needed)
  - All filter types implemented:
    - `TextFilter` for text inputs
    - `SelectFilter` for dropdowns (genre, difficulty)
    - `BooleanFilter` for radio buttons (organ, percussion)
    - `FileFilter` for file presence
  - Filter persistence via user preferences (`ndb_column_filters`)
  - Coordinated reset between toolbar and column filters
  - Blue outline styling for active filters (not green background)
  - "Spalten konfigurieren" button aligned with table edge
  - "alle Filter zurücksetzen" button right-aligned in filter row
  - Table headers remain visible when no results (allows fixing filter typos)

- ✅ **TABLE-3:** Filter Persistence (Mobile UI not needed)
  - Column filters already persist via user preferences
  - Mobile support not required per user decision

**Test Infrastructure**
- ✅ Complete test setup with MSW 2.11.3 for API mocking
- ✅ React Testing Library 16.3.0 + jest-dom 6.9.1
- ✅ Jest configured for React components with jsdom
- ✅ MSW handlers for all NDB API endpoints
- ✅ Test utilities and helpers (`testUtils.tsx`)
- ✅ **103 tests written and passing:**
  - 11 tests for filter utilities
  - 28 tests for column configuration
  - 21 tests for instrumentation parsing
  - 20 tests for Button component
  - 11 tests for TextFilter component
  - 12 tests for SelectFilter component
  - 12 tests for BooleanFilter component

### 🚧 In Progress

**Phase 3: Setlist Management**
- Implementation starting based on fully-implemented backend API

### 📋 Backend API Status

**NDB API (ensemble-web-ndb) - Setlists COMPLETE**
- ✅ Single worksheet design with redundant data (setlistId, setlistName, scoreId, orderIndex, allocations)
- ✅ GET /v1/setlists - List all setlists with full details
- ✅ POST /v1/setlist - Create new setlist
- ✅ PUT /v1/setlist - Update setlist (setlistId in body)
- ✅ POST /v1/download/setlist - Download ZIP with ordered score PDFs
- ✅ 48 integration tests passing
- ✅ Retry logic with exponential backoff
- ✅ Comprehensive validation
- **Note:** NO DELETE endpoint (not supported by API)

### 📊 Progress Summary

**Infrastructure:** 3/4 completed (75%) - INFRA-2 removed (no delete operations in API)
- ✅ INFRA-1, INFRA-4, INFRA-5
- ⏳ INFRA-3 (optional)

**Table Features:** 3/4 completed (75%)
- ✅ TABLE-1, TABLE-2, TABLE-3
- ⏳ TABLE-4 (low priority)

**Setlist Features:** 0/8 tasks
- Backend API ready, frontend implementation starting

**Test Coverage:** Excellent
- 7 test suites, 103 tests, all passing
- MSW mocking infrastructure ready for integration tests

---

## Complete Development Backlog

### 🎯 Infrastructure Foundation

**INFRA-1: Toast Notification System** ✅ COMPLETE
- `sonner` library (v2.0.7) installed
- `ToastProvider` wrapper component created
- Integrated into app layout
- Already in use across NDB pages and hooks
- Documentation in `docs/infrastructure-usage.md`

~~**INFRA-2: Confirmation Dialog Component**~~ REMOVED
- Delete operations not supported by NDB API
- No longer needed

**INFRA-3: Error Boundaries** (Low Priority - Optional)
- Create `ErrorBoundary` component with fallback UI
- Create `ErrorFallback` component (friendly message + retry button)
- Wrap key sections: setlist pages, score pages, file uploads
- Log errors to console (prepare for future logging service)
- **Depends on:** Nothing

**INFRA-4: Empty States** (Medium Priority)
- Create `EmptyState` component with icon, heading, message, optional action
- Create variants: no-results, no-data, error-state
- Use in: scores list, setlist list, address list
- **Depends on:** Nothing

**INFRA-5: User Preferences System** (High Priority)
- Create `src/next/ndb/utils/preferences.ts` utility
- Functions: `getUserPreference(userId, key)`, `setUserPreference(userId, key, value)`
- Use Payload Preferences API (`payload-preferences` collection)
- Implement hybrid approach: Payload (primary) + localStorage (cache)
- Create React hook: `useUserPreference(key, defaultValue)`
- Handle logged-out users (localStorage only)
- **Depends on:** Nothing
- **Blocks:** TABLE-1, TABLE-3

---

### 🔍 Advanced Table Filtering

**TABLE-1: Column Configuration System** (High Priority)
- Define `ColumnConfig` interface
- Storage: Payload Preferences with key `ndb_column_preferences`
- Create "Spalten" button in toolbar
- Create `ColumnSettingsModal.tsx` with checkboxes
- Always visible: title, composer, parts, fullScore
- Default visible: arranger (xl+), instrumentation (lg+), organ (xl+), percussion (xl+)
- Optional: genre, publisher, difficulty, comment, moderation, audioMidi, audioMp3
- "Zurücksetzen" button to restore defaults
- Update `Table.tsx` to support dynamic columns
- Gracefully degrade on mobile (hide "Spalten" button)
- **Depends on:** INFRA-5
- **Blocks:** TABLE-2, TABLE-3

**TABLE-2: Column-Based Filtering - Core** (High Priority)
- Add filter icon (funnel) to column headers
- Create `FilterPopover.tsx` generic component
- Active filter: filled icon + colored indicator
- Implement filter types:
  - `TextFilter.tsx` for: title, composer, arranger, publisher, comment
  - `SelectFilter.tsx` for: genre, difficulty
  - `BooleanFilter.tsx` for: organ, percussion
  - File filter for: parts, fullScore, audioMidi, audioMp3 (has/doesn't have)
- Apply filters with AND logic
- Combine with existing toolbar search (OR across title/composer/arranger)
- Update `ScoresTable.tsx` with filter logic
- **Depends on:** Nothing (works better after TABLE-1)
- **Blocks:** TABLE-3

**TABLE-3: Filter Persistence & Mobile** (High Priority)
- Storage: Payload Preferences with key `ndb_active_filters`
- Load filters on mount, save changes immediately
- Persist when navigating to detail page and back
- "Alle Filter zurücksetzen" clears and updates preferences
- Mobile: Hide per-column filter icons
- Mobile: Create `MobileFilterSheet.tsx` (bottom sheet)
- Mobile: "Erweiterte Filter" button with active filter count badge
- Create `FilterBadge.tsx` for active indicators
- **Depends on:** TABLE-2, INFRA-5
- **Blocks:** Nothing

**TABLE-4: Instrumentation Filter Enhancement** (Low Priority)
- Add instrumentation filter popover
- Number inputs for min/max: horns, trumpets, trombones
- Keep existing quick filter buttons in toolbar
- Combine with quick filters (AND logic)
- **Depends on:** TABLE-2

---

### 🎵 Setlist Management - Core

**SETLIST-1: Data Structures & API Setup** (High Priority)
- Add TypeScript interfaces to `types.ts`: `Setlist`, `SetlistItem`, `PlayerAllocation`
- Add `DEFAULT_PARTS` constant to `constants.ts`
- Create API routes: `/api/ndb/setlists/*` (list, get, post, put, delete, download)
- Update `client.ts` with setlist methods
- Follow existing proxy pattern in `proxy.ts`
- **Depends on:** Nothing
- **Blocks:** SETLIST-2, SETLIST-3

**SETLIST-2: Setlist List Page** (High Priority)
- Create `SetlistsTable.tsx` component
- Table columns: Display Name, Date, # Scores, Actions
- Create list page at `/intern/ndb/setlists/page.client.tsx`
- "Neue Setlist" button → create page
- Actions: View/Edit, Delete (with confirmation), Download ZIP
- Back link to `/intern`
- Empty state when no setlists
- Toast notifications on success/error
- **Depends on:** SETLIST-1, INFRA-1 (toast), INFRA-2 (confirm), INFRA-4 (empty state)
- **Blocks:** SETLIST-3

**SETLIST-3: Setlist Editor - Basic** (High Priority)
- Create detail/edit page at `/intern/ndb/setlists/[id]/page.client.tsx`
- Form: displayName (required), date (optional)
- Create `SetlistScoreSearch.tsx` (AutocompleteField)
- Create `SetlistItemList.tsx` (static list, no drag-drop yet)
- Add/remove scores (remove with confirmation)
- State: React state holds entire Setlist object
- "Speichern" button saves via PUT, "Abbrechen" discards
- Toast on save success/error
- Unsaved changes indicator (isDirty state)
- Data validation: required displayName
- Hover states on interactive elements
- **Depends on:** SETLIST-2
- **Blocks:** SETLIST-4, SETLIST-5

**SETLIST-4: Drag & Drop Reordering** (High Priority)
- Install `@dnd-kit/core` and `@dnd-kit/sortable`
- Convert `SetlistItemList` to `DraggableSetlistItemList`
- Add drag handle icon to each item
- Visual feedback during drag
- Update orderIndex in local state on drop
- No immediate save - waits for "Speichern"
- Mobile: larger touch targets
- **Depends on:** SETLIST-3
- **Blocks:** Nothing

**SETLIST-5: Setlist Visual Polish** (Low Priority)
- Transition animations for add/remove items
- Loading skeleton loaders during fetch
- Progress indicators during save
- Mobile: card view for setlist list
- Mobile: full-screen score search overlay
- Sticky back-to-top button
- **Depends on:** SETLIST-3, SETLIST-4

---

### 📊 Player Allocations

**ALLOC-1: Allocation Grid - Core** (High Priority)
- Create `PlayerAllocationGrid.tsx` component
- Grid layout: rows = scores, columns = parts
- Start with DEFAULT_PARTS (14 columns)
- Each cell: TextField input for player name (string)
- Update allocations in local state (debounced)
- Desktop: full grid (horizontal scroll if >14 columns)
- Grid headers: part names, row headers: score titles
- **Depends on:** SETLIST-3
- **Blocks:** ALLOC-2, ALLOC-3

**ALLOC-2: Dynamic Parts & Tab Navigation** (High Priority)
- Scan existing allocations for additional parts
- "Teil hinzufügen" button (prompts for name)
- "Teil entfernen" button (with confirmation)
- Tab navigation: Tab 1 "Übersicht" (scores), Tab 2 "Besetzung" (grid)
- Both tabs share Setlist state
- "Speichern" button in both tabs (sticky footer)
- Tab indicator shows active tab
- **Depends on:** ALLOC-1
- **Blocks:** ALLOC-3

**ALLOC-3: Mobile Allocation Grid** (High Priority)
- Tablet: horizontal scroll with pinned score column
- Mobile: vertical stacked cards (part inputs per score, collapsible)
- **Depends on:** ALLOC-1

**ALLOC-4: Print Stylesheet** (Low Priority)
- CSS `@media print` styles
- Clean table layout, no colors, paper-optimized
- Print button with printer icon
- Page breaks if needed
- **Depends on:** ALLOC-2

**ALLOC-5: Player Input Enhancement** (Low Priority)
- Convert TextField to AutocompleteField
- Fetch user names from `getAllEnrichedUsers()`
- Learn from previous allocations
- User can still type arbitrary string
- **Depends on:** ALLOC-1

**ALLOC-6: Conflict Detection** (Low Priority)
- Detect conflicts (same player, multiple parts, same score)
- Visual indicator (warning icon, yellow highlight)
- Tooltip explaining conflict
- **Depends on:** ALLOC-1

---

### 🔗 Payload + NDB Integration

**INTEGRATION-1: Inline Edit Buttons** (High Priority)
- "Event bearbeiten" button on event pages (admin only)
- "Neues Event" button on internal home
- Deep links to Payload admin
- Opens in new tab
- **Depends on:** Nothing

**INTEGRATION-2: Admin Role Checks** (High Priority)
- Create `isAdmin()` utility function
- Consistent role checking across pages
- Hide admin UI for non-admins
- **Depends on:** Nothing

**INTEGRATION-3: Unified Sidebar Navigation** (High Priority)
- Create sidebar component for internal area
- Same sidebar in Payload admin (extend Payload's sidebar if possible)
- Sections: Übersicht, Notendatenbank (Noten, Setlists), Adressliste, Verwaltung (admin only)
- Persistent across navigation
- **Depends on:** Nothing

**INTEGRATION-4: SetlistBlock for Payload** (High Priority)
- Custom block in rich text editor
- Single parameter: setlistId (number)
- Embedded view mode (read-only display)
- Embedded edit mode (full editor with allocations)
- Toggle between view/edit in block settings
- Used in: Events, Pages
- **Depends on:** SETLIST-3, ALLOC-1
- **Blocks:** Nothing

**INTEGRATION-5: Event ↔ Setlist Soft Linking** (Medium Priority)
- Add setlistId field (number) to Events collection
- Display linked setlist on event page
- "Setlist zuordnen" dropdown on event edit
- No Payload Setlists collection (NDB API only)
- **Depends on:** SETLIST-1

**INTEGRATION-6: AddressListBlock for Payload** (Medium Priority)
- Custom block in rich text editor
- Parameters: title, filterByInstrument, showContactInfo
- Embeds filtered address list
- **Depends on:** Nothing

**INTEGRATION-7: ScoreDetailBlock for Payload** (Low Priority)
- Custom block in rich text editor
- Parameter: scoreId (number)
- Embeds score detail card
- **Depends on:** Nothing

**INTEGRATION-8: Quick Actions from Score Page** (Low Priority)
- "Zu Setlist hinzufügen" button on score detail
- Modal with setlist selector
- Add score to selected setlist
- **Depends on:** SETLIST-1

**INTEGRATION-9: Event Creation Wizard** (Low Priority)
- Custom wizard at `/intern/events/new`
- Multi-step: Basic info → Concert info → Setlist → Summary
- Creates event + optionally links setlist
- **END OF ROADMAP PRIORITY**
- **Depends on:** INTEGRATION-5

---

### 📁 File Management

**FILE-1: Drag & Drop Upload** (Medium Priority)
- Add drag-drop zones to file upload fields
- Visual feedback (border highlight)
- Toast notification on drop
- Error handling for wrong types
- Update `FileUploadField.tsx`
- **Depends on:** INFRA-1 (toast)
- **Blocks:** FILE-2

**FILE-2: Upload Progress & Preview** (Low Priority)
- Upload progress bar/percentage
- PDF thumbnails (first page)
- Cancel upload button
- File size validation
- **Depends on:** FILE-1

**FILE-3: Download Improvements** (Low Priority)
- Toast notifications on error
- Loading indicator
- Error handling
- **Depends on:** INFRA-1 (toast)

---

### 📋 Address List Enhancements

**ADDR-1: CSV Export** (Medium Priority)
- Create `exportAddressListToCSV()` utility
- Columns: Name, Instruments, Email, Phone, Street, Location
- Download button in toolbar
- Filename: `adressliste_${date}.csv`
- Toast on success
- **Depends on:** INFRA-1 (toast)

**ADDR-2: PDF Export** (Medium Priority)
- Install `jsPDF` or `pdfmake`
- Formatted PDF with sections per player
- Download button next to CSV
- Filename: `adressliste_${date}.pdf`
- Toast on success
- **Depends on:** INFRA-1 (toast)

**ADDR-3: Print Stylesheet** (Low Priority)
- CSS `@media print` styles
- Black & white optimized
- Print button in toolbar
- **Depends on:** Nothing

**ADDR-4: vCard Export** (Low Priority)
- Create `.vcf` file (vCard 3.0 format)
- "vCard herunterladen" button per card OR bulk
- Include name, phone, email, address, instruments
- **Depends on:** Nothing

---

### ♿ Accessibility

**A11Y-1: ARIA Labels** (Medium Priority)
- Add `aria-label` to icon-only buttons
- Add `aria-describedby` to form fields
- Add `aria-live="polite"` to toasts
- Add `aria-expanded` to popovers/modals
- Add `role="grid"` to allocation grid
- Test with VoiceOver/NVDA
- **Depends on:** Nothing

**A11Y-2: Keyboard Shortcuts** (Low Priority)
- Define shortcuts: `/` (search), `n` (new), `c` (columns), `?` (help)
- Create `KeyboardShortcuts` component
- Help modal showing shortcuts
- Announce to screen readers
- **Depends on:** Nothing

**A11Y-3: Screen Reader Audit** (Low Priority)
- Descriptive link text (avoid "click here")
- Proper heading hierarchy (h1 → h2 → h3)
- Form labels associated with inputs
- Table headers with scope
- Loading states announced: `aria-busy="true"`
- Test full flows with screen reader
- **Depends on:** A11Y-1

---

### 🧪 Testing & Logging

**TEST-1: E2E Test Setup** (Medium Priority)
- Install Playwright
- Configure for Next.js 15
- GitHub Actions CI setup
- Test utilities and helpers
- **Depends on:** Nothing
- **Blocks:** TEST-2

**TEST-2: Core E2E Tests** (Medium Priority)
- Login, search scores, filters, columns
- Create/edit/delete setlist
- Add scores, reorder, allocations
- Download files
- Export address list
- Screenshot on failure
- **Depends on:** TEST-1, features being tested

**TEST-3: Better Error Logging** (Medium Priority)
- Create `src/next/ndb/utils/logger.ts`
- Log to console in dev, prepare for Sentry in prod
- Include context: action, timestamp, stack, user ID
- Log API errors with URL, method, status
- Integrate with Error Boundaries
- **Depends on:** INFRA-3

**TEST-4: API Mocks** (Low Priority)
- Install MSW (Mock Service Worker)
- Create mocks for NDB API
- Use in Storybook and tests
- **Depends on:** Nothing

---

### 🚀 Performance

**PERF-1: Code Splitting** (Medium Priority)
- Dynamic imports: allocation grid, PDF export, @dnd-kit, column modal
- Install `@next/bundle-analyzer`
- Analyze bundle
- Lazy load icons
- Loading fallbacks
- **Depends on:** Nothing

**PERF-2: Image Optimization** (Low Priority)
- Use Next.js `<Image>` component
- Optimize icon SVGs
- Responsive images with srcset
- Lazy load below fold
- **Depends on:** Nothing

**PERF-3: SSG for Score Detail Views** (Medium Priority)
- Generate static pages for all scores at build
- Use `generateStaticParams`
- Set revalidation: `export const revalidate = 3600`
- On-demand revalidation with `revalidatePath`
- Fallback to SSR for new scores
- **Depends on:** Nothing

**PERF-4: API Response Caching** (Requires Discussion/Approval)
- Install `@tanstack/react-query`
- Wrap app in `QueryClientProvider`
- Create hooks: `useScores()`, `useScore(id)`, `useSetlists()`, `useSetlist(id)`, `useUsers()`
- Configure stale time, cache time
- Cache invalidation on mutations
- Optimistic updates
- **Depends on:** User approval
- **Note:** TanStack Query approach needs approval before implementation

---

### 🎨 UI Polish

**POLISH-1: Storybook Setup** (Low Priority)
- Install Storybook for Next.js 15
- Create stories for reusable components
- Document props, variants
- Optional: Chromatic visual regression
- **Depends on:** Nothing

**POLISH-2: UI Refinements** (Low Priority)
- Search result count ("23 Noten gefunden")
- Transition animations (fade, slide)
- Swipe actions on mobile
- Bottom navigation on mobile
- Pull-to-refresh on mobile lists
- Smooth scroll-to-top button
- **Depends on:** Nothing

**POLISH-3: Form Validation UI** (Low Priority)
- Inline validation (on blur)
- Error messages below fields
- Visual indicators (red border, icon)
- Success indicators (green checkmark)
- Helper text
- **Depends on:** Nothing

---

### 🔐 Security & Advanced

**SEC-1: Data Validation** (Medium Priority)
- Required field enforcement
- Format validation (date, email)
- Client-side validation before API calls
- Server-side validation in API routes
- Toast error messages
- **Depends on:** INFRA-1 (toast)

**SEC-2: Input Sanitization** (Low Priority)
- Install DOMPurify
- Sanitize rich text fields
- Escape user strings
- Sanitize file names
- **Depends on:** Nothing

**SEC-3: Rate Limiting** (Low Priority)
- Next.js middleware for rate limiting
- Limit per IP
- Return 429 when exceeded
- **Depends on:** Nothing

**SEC-4: Audit Logs** (Low Priority)
- Send username via `X-User-Name` header
- Log: create, update, delete actions
- Include timestamp, user, action, resource
- **Depends on:** Nothing

**SEC-5: Session Timeout Warnings** (Low Priority)
- Detect Payload session timeout
- Modal 5 min before expiry
- "Verlängern" button to refresh
- Auto-logout on timeout
- **Depends on:** Nothing

**ADV-1: Score Preview Modal** (Low Priority)
- Modal for PDF preview
- Embed pdf.js or `<iframe>`
- Full-screen with close button
- Next/previous buttons
- Download in modal
- Keyboard navigation
- **Depends on:** Nothing

**ADV-2: Setlist Advanced Features** (Low Priority)
- Duplicate setlist ("Kopieren" button)
- Setlist templates (no date, reusable)
- Export setlist as PDF
- Print optimization with page breaks
- **Depends on:** ALLOC-2, ALLOC-4

---

## Recommended Implementation Order

### Phase 1: Foundation (Weeks 1-2)
Start here for maximum impact on future work:
1. **INFRA-5** (User Preferences) - Required for tables
2. **INFRA-1** (Toast) - Required for feedback everywhere
3. **INFRA-2** (Dialogs) - Required for confirmations
4. **INFRA-3, INFRA-4** (Errors, Empty States)

### Phase 2: Advanced Tables (Weeks 3-4)
Build on preferences foundation:
1. **TABLE-1** (Column Configuration)
2. **TABLE-2** (Column Filters)
3. **TABLE-3** (Persistence & Mobile)

### Phase 3: Setlist Core (Weeks 5-7)
Major feature development:
1. **SETLIST-1** (Data & API)
2. **SETLIST-2** (List Page)
3. **SETLIST-3** (Editor)
4. **SETLIST-4** (Drag & Drop)

### Phase 4: Allocations (Weeks 8-9)
Complete setlist functionality:
1. **ALLOC-1** (Grid Core)
2. **ALLOC-2** (Dynamic Parts & Tabs)
3. **ALLOC-3** (Mobile)

### Phase 5: Integration (Weeks 10-11)
Connect Payload and NDB:
1. **INTEGRATION-1, 2** (Edit Buttons & Roles)
2. **INTEGRATION-3** (Unified Sidebar)
3. **INTEGRATION-4** (SetlistBlock)
4. **INTEGRATION-5** (Event Linking)

### Phase 6: Enhancements (Weeks 12+)
Polish and improvements:
- File Management (FILE-1, 2, 3)
- Address List Exports (ADDR-1, 2)
- Accessibility (A11Y-1)
- Testing (TEST-1, 2, 3)
- Performance (PERF-1, 3)
- Remaining integrations (INTEGRATION-6, 7, 8)

### Phase 7: Polish & Advanced (Ongoing)
Low priority items as needed:
- UI Polish (POLISH-1, 2, 3)
- Security enhancements (SEC-2, 3, 4, 5)
- Advanced features (ADV-1, 2)
- Event wizard (INTEGRATION-9) - **END OF ROADMAP**

---

## Working Model

**Kanban Style:** No sprints or releases. Work on one item at a time as directed by the project owner.

**Dependencies:** Some items depend on others. Generally best to respect dependencies, but can work out of order if needed.

**Flexibility:** Items can be modified, split, combined, or skipped. This is a living backlog.

---

## Quick Reference: Current State

**Architecture:**
- Next.js 15 + React 19 + TypeScript
- PayloadCMS 3 with PostgreSQL
- External NDB API (Basic Auth via proxy)
- TailwindCSS 4.0 for styling

**Current Pages:**
- `/intern` - Internal home with events
- `/intern/ndb` - Score list (NDB-powered)
- `/intern/ndb/[id]` - Score detail (NDB-powered)
- `/intern/players` - Address list (Payload Users)
- `/intern/events/[slug]` - Event detail (Payload content)

**Planned Pages:**
- `/intern/ndb/setlists` - Setlist list
- `/intern/ndb/setlists/[id]` - Setlist editor
- `/intern/events/new` - Event wizard (low priority, end of roadmap)

**Key Patterns:**
- API proxy: Client → `/api/ndb/*` → External NDB API
- User preferences: Payload Preferences API + localStorage cache
- Payload blocks: Custom blocks for embedding NDB components
- Sidebar navigation: Unified across internal pages and Payload admin

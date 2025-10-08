# Ensemble Web

[![Tests](https://github.com/holtschn/ensemble-web/actions/workflows/test.yml/badge.svg)](https://github.com/holtschn/ensemble-web/actions/workflows/test.yml)
[![License: GPL-3.0](https://img.shields.io/badge/License-GPL--3.0-blue.svg)](LICENSE)

A modern web application for brass ensemble management, featuring a public website and an internal "Notendatenbank" (sheet music database) system.

## Features

- 🎵 **Notendatenbank (NDB)** - Comprehensive sheet music management system
  - Score catalog with metadata (composer, arranger, instrumentation, difficulty)
  - File management (parts, full scores, audio samples)
  - Advanced filtering and column configuration
  - Setlist creation and management
  - Player allocations for performances
- 📄 **Content Management** - Dynamic pages and content via PayloadCMS
- 🔐 **Authentication** - User management and role-based access control
- 📅 **Event Management** - Calendar and event information
- 📱 **Responsive Design** - Mobile-first, fully responsive UI
- ⚡ **Performance Optimized** - Server-side caching and static generation

## Tech Stack

- **Frontend:** [Next.js 15](https://nextjs.org/) (App Router) + [React 19](https://react.dev/)
- **CMS:** [PayloadCMS 3](https://payloadcms.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **Styling:** [TailwindCSS 4](https://tailwindcss.com/)
- **Storage:** [Vercel Blob Storage](https://vercel.com/docs/storage/vercel-blob)
- **Email:** [Nodemailer](https://nodemailer.com/)
- **Testing:** [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/react) + [MSW](https://mswjs.io/)

## Prerequisites

- **Node.js** 20.x or higher
- **PostgreSQL** database
- **npm** or **yarn** package manager

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/holtschn/ensemble-web.git
   cd ensemble-web
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy the example environment file and configure it:

   ```bash
   cp .env.example .env.local
   ```

   Key environment variables to configure:

   - `POSTGRES_URL` - PostgreSQL connection string
   - `POSTGRES_SCHEMA` - Database schema name
   - `PAYLOAD_SECRET` - Secret for PayloadCMS sessions
   - `NDB_API_URL` - External NDB API base URL
   - `NDB_USERNAME` / `NDB_PASSWORD` - NDB API credentials
   - `BLOB_READ_WRITE_TOKEN` - Vercel Blob Storage token
   - `NODEMAILER_HOST` / `NODEMAILER_USER` / `NODEMAILER_PASS` - Email configuration

   See [`.env.example`](.env.example) for the complete list of required variables.

4. **Run database migrations** (if needed)

   ```bash
   npm run payload migrate
   ```

5. **Generate TypeScript types**

   ```bash
   npm run generate:types
   ```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at:
- **Main site:** http://localhost:3000
- **PayloadCMS admin:** http://localhost:3000/admin

### Other Development Commands

```bash
# Development with cache clearing
npm run devsafe

# Code quality
npm run lint        # Run ESLint
npm run format      # Format code with Prettier

# Build for production
npm run build

# Start production server
npm start
```

## Testing

The project uses Jest with React Testing Library and MSW for API mocking.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run NDB-specific tests
npm run test:ndb

# Run tests in CI mode
npm run test:ci
```

Current test coverage:
- **162 tests** across 9 test suites
- Comprehensive coverage of NDB utilities and components
- MSW handlers for all API endpoints

## Project Structure

```
.
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (pages)/             # Public pages group
│   │   │   ├── intern/ndb/     # Internal sheet music database
│   │   │   └── api/            # API routes
│   │   └── (payload)/          # PayloadCMS admin group
│   │
│   ├── next/                    # Next.js-specific code
│   │   ├── ndb/                # Notendatenbank module
│   │   │   ├── api/           # API client and proxy
│   │   │   ├── components/    # UI components
│   │   │   ├── hooks/         # React hooks
│   │   │   └── utils/         # Utility functions
│   │   ├── auth/              # Authentication
│   │   └── components/        # Shared components
│   │
│   └── payload/                # PayloadCMS configuration
│       ├── collections/       # Data collections
│       └── globals/           # Global configs
│
├── old.gui/                    # Legacy reference code (READ-ONLY)
└── .github/workflows/         # CI/CD workflows
```

## Deployment

This application is designed to be deployed on [Vercel](https://vercel.com/):

1. **Connect your repository** to Vercel
2. **Configure environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

### Build Command
```bash
npm run build
```

### Environment Variables
Ensure all variables from `.env.example` are configured in your Vercel project settings.

## PayloadCMS

Access the PayloadCMS admin panel at `/admin` to manage:
- Users and authentication
- Media files
- Pages and content
- Events
- Site settings (header, footer)

### Generate Types

After modifying PayloadCMS collections or globals:

```bash
npm run generate:types
```

This updates `src/payload-types.ts` with TypeScript type definitions.

## Contributing

For development guidance and architectural decisions, see [CLAUDE.md](CLAUDE.md).

### Development Workflow

1. Check the roadmap in [CLAUDE.md](CLAUDE.md)
2. Create a feature branch from `develop`
3. Implement changes with tests
4. Run tests and linting
5. Submit a pull request to `develop`

## License

This project is licensed under the **GNU General Public License v3.0** - see the [LICENSE](LICENSE) file for details.

## Architecture Notes

- **API Proxy Pattern:** All NDB API calls go through Next.js API routes for security (Basic Auth credentials hidden server-side)
- **Server Components:** Leverages Next.js 15 Server Components for performance and SEO
- **Data Cache:** Built-in caching with tag-based revalidation
- **User Preferences:** Hybrid storage with Payload Preferences API + localStorage

For detailed architecture documentation, see [CLAUDE.md](CLAUDE.md).

## Known Issues

See [CLAUDE.md - Known Issues](CLAUDE.md#known-issues) for current issues and planned fixes.

## Support

For bugs and feature requests, please [open an issue](https://github.com/holtschn/ensemble-web/issues).

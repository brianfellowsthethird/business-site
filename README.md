# Tariff Impact Site

A data-driven website tracking the economic impact of U.S. tariff policies on American families and businesses.

## Features

- **Auto-updating data pipeline** pulling from FRED, Census, BLS, USDA, and USTR
- **Interactive visualizations** using ECharts with policy timeline annotations
- **Module-based structure** covering multiple impact areas (soybeans, steel/aluminum, consumer goods, etc.)
- **Source attribution** on every metric and chart
- **Methodology transparency** with confounder notes

## Tech Stack

- **Next.js 14** (App Router) with TypeScript
- **Turso (libSQL)** for data storage
- **ECharts** for visualizations
- **Tailwind CSS** for styling
- **Date-fns** for date formatting

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Required variables:
- `FRED_API_KEY` - Get from https://fred.stlouisfed.org/docs/api/api_key.html
- `BLS_API_KEY` - Get from https://www.bls.gov/developers/api_signature.htm
- `TURSO_DATABASE_URL` - For production (optional, defaults to local SQLite)
- `TURSO_AUTH_TOKEN` - For Turso production database
- `NEXT_PUBLIC_BASE_URL` - Base URL for API calls (defaults to localhost:3000)

3. Initialize the database:
```bash
npm run init-db
```

4. Seed sample modules:
```bash
npm run seed-modules
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
/workspace
??? app/                    # Next.js App Router pages
?   ??? api/               # API routes
?   ??? modules/           # Module pages
?   ??? page.tsx           # Homepage
??? components/            # React components
?   ??? charts/           # ECharts components
?   ??? KPITile.tsx       # KPI display component
?   ??? HeadlineBlock.tsx  # Headline component
??? data/                  # Configuration
?   ??? sources.json      # Data source registry
??? lib/
?   ??? adapters/         # Data source adapters (FRED, BLS, Census)
?   ??? db/               # Database client and schema
?   ??? types.ts          # TypeScript types
??? scripts/              # Utility scripts
    ??? init-db.ts        # Database initialization
    ??? seed-modules.ts   # Sample data seeding
```

## Data Pipeline

The site uses adapters to pull data from various sources:

- **FRED Adapter**: Economic data (prices, indices)
- **Census Adapter**: Trade statistics
- **BLS Adapter**: Producer and Consumer Price Indices

Data is stored in a normalized database schema with time-series points, computed metrics, and policy events.

## Modules

Each module covers a specific impact area:
- Soybeans (agriculture exports)
- Steel/Aluminum (manufacturing inputs)
- Consumer Goods (retail prices)
- Auto/EV (vehicle imports)
- Small Business (conditions)
- Policy Timeline (cross-cutting)

More modules can be added by updating `scripts/seed-modules.ts` and adding data sources to `data/sources.json`.

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Legal & Ethical

All data comes from publicly available government sources. The site includes disclaimers and source attribution on all content. See the planning canvas for the full legal checklist.

## License

[Add license information]

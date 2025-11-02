# Getting Started

This guide will help you set up and run the Tariff Impact Site.

## Prerequisites

- Node.js 18+ and npm
- API keys for data sources (optional for initial setup)

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   - `FRED_API_KEY` - Get from https://fred.stlouisfed.org/docs/api/api_key.html
   - `BLS_API_KEY` - Get from https://www.bls.gov/developers/api_signature.htm

   Note: You can start without API keys, but data will need to be seeded manually.

3. **Initialize the database:**
   ```bash
   npm run init-db
   ```
   
   This creates the SQLite database file (`tariff_impact.db`) in the project root.

4. **Seed sample modules:**
   ```bash
   npm run seed-modules
   ```
   
   This adds initial module definitions to the database.

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Next Steps

### Add Real Data

To populate the site with actual data, you'll need to:

1. Set up data pipeline jobs (cron tasks) to fetch from APIs
2. Use the adapters in `lib/adapters/` to pull data
3. Store data using functions in `lib/db/client.ts`

Example:
```typescript
import { fetchSeriesFromSource } from '@/lib/adapters';
import { insertTimeSeries, insertDataPoint } from '@/lib/db/client';

// Fetch data from FRED
const series = await fetchSeriesFromSource('fred', 'PSOYBUSDM');

// Store in database
await insertTimeSeries({
  id: series.id,
  name: series.name,
  source: series.source,
  units: series.units,
  frequency: series.frequency,
  last_updated: series.last_updated,
});

for (const point of series.data) {
  await insertDataPoint(point, series.id);
}
```

### Create Data Pipeline Jobs

Set up scheduled jobs (using cron, GitHub Actions, or a service like Vercel Cron) to:

- `pull_fred_prices` (daily)
- `pull_bls_ppi_ces` (daily)
- `pull_census_trade` (daily)
- `pull_usda_fas` (weekly)
- `pull_policy_events` (daily)
- `compute_metrics` (nightly)

See the planning canvas for details on each job.

### Add More Modules

Edit `scripts/seed-modules.ts` to add new modules following the existing pattern. Each module needs:
- `id` and `slug`
- `title`, `headline`, and optional `subhead`
- `series` array (IDs that match entries in `data/sources.json`)
- `policy_band` if applicable
- `methodology` and `confounders` for transparency

## Project Structure

- `/app` - Next.js pages and API routes
- `/components` - React components (charts, KPIs, etc.)
- `/lib/adapters` - Data source adapters (FRED, BLS, Census)
- `/lib/db` - Database client and schema
- `/data` - Configuration files (sources.json)
- `/scripts` - Utility scripts for database setup

## Troubleshooting

**Database errors:**
- Make sure `npm run init-db` completed successfully
- Check that `tariff_impact.db` file exists in project root
- For Turso, verify `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` are set

**API errors:**
- Verify API keys are set in `.env`
- Check API rate limits
- Some APIs may require registration

**Build errors:**
- Run `npm run type-check` to find TypeScript errors
- Run `npm run lint` to check for linting issues

## Production Deployment

1. Set up a Turso database (or use your preferred SQL database)
2. Configure environment variables in your hosting platform
3. Set up cron jobs for data pipeline
4. Build and deploy: `npm run build && npm start`

## Support

See `README.md` for more detailed documentation and `tariff_impact_site_planning_canvas.md` for the full project specification.

# Data Pipeline Jobs

This directory contains ETL (Extract, Transform, Load) jobs for fetching and processing data from various sources.

## Job Architecture

All jobs extend `BaseJob` which provides:
- Error handling and logging
- Idempotency checks
- Data validation
- Standardized execution patterns

## Available Jobs

### pull-fred-prices.ts
Fetches economic indicators from FRED API.

**Usage:**
```bash
npm run job:pull-fred
```

**What it does:**
- Fetches all series defined in `data/sources.json` for FRED
- Validates data using Zod schemas
- Stores time series metadata and data points in database
- Handles duplicates gracefully (unique constraint)

**Requirements:**
- `FRED_API_KEY` environment variable

**Frequency:** Daily

---

### pull-bls-ppi-ces.ts
Fetches Producer Price Index (PPI) and Consumer Price Index (CPI) data from BLS.

**Usage:**
```bash
npm run job:pull-bls
```

**What it does:**
- Fetches PPI and CPI series defined in `data/sources.json` for BLS
- Gets 5 years of historical data
- Validates and stores data points
- Handles BLS-specific data format (period codes like "M01")

**Requirements:**
- `BLS_API_KEY` environment variable

**Frequency:** Daily

---

### pull-census-trade.ts
Fetches trade statistics from U.S. Census Bureau.

**Usage:**
```bash
npm run job:pull-census
```

**What it does:**
- Fetches import/export trade data defined in `data/sources.json` for Census
- Supports exports and imports by trade type
- Handles HS codes and country filters
- Parses Census API response formats

**Requirements:**
- Census Trade API access (may require registration)
- Configure endpoints in `data/sources.json`

**Frequency:** Daily

**Note:** Census API endpoints may vary and require configuration. Some endpoints may need special access.

---

### compute-metrics.ts
Computes KPIs and metrics from time series data.

**Usage:**
```bash
npm run job:compute-metrics
```

**What it does:**
- Calculates YoY and MoM deltas
- Compares against policy baseline (if applicable)
- Generates sparklines for KPI tiles
- Determines trends (up/down/stable)
- Updates metrics in database

**Requirements:**
- Time series data must exist in database
- Run after data pulls

**Frequency:** Nightly (after data pulls)

---

## Adding New Jobs

1. Create a new file in `scripts/jobs/`
2. Extend `BaseJob` class
3. Implement `execute()` method
4. Add npm script to `package.json`
5. Document in this README

Example:
```typescript
import { BaseJob } from './base-job';

export class MyNewJob extends BaseJob {
  constructor() {
    super('my-new-job');
  }

  async execute(): Promise<void> {
    // Your job logic here
  }
}

if (require.main === module) {
  const job = new MyNewJob();
  job.run().then(/* ... */);
}
```

## Scheduling Jobs

### Local Development
- Run manually: `npm run job:pull-fred`
- Use `node-cron` for local scheduling (optional)

### Production
Options:
1. **Vercel Cron** - Add to `vercel.json`:
   ```json
   {
     "crons": [{
       "path": "/api/cron/pull-fred",
       "schedule": "0 2 * * *"
     }]
   }
   ```

2. **GitHub Actions** - Create `.github/workflows/data-pipeline.yml`

3. **External Scheduler** - Use services like:
   - Railway Cron
   - EasyCron
   - Cron-job.org

## Error Handling

Jobs catch and log errors but continue processing other items when possible. Check logs for:
- `[job-name] Starting job...`
- `[job-name] Job completed successfully`
- `[job-name] Job failed: [error message]`

## Monitoring

Consider adding:
- Job status tracking in database
- Alerting on failures (email/Slack)
- Metrics dashboard (`/admin` page)

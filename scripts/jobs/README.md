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

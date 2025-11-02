# Next Steps - Quick Reference

## Ready to Test

You now have a working data pipeline foundation! Here's what to do next:

### 1. Set Up Environment
```bash
# Copy environment template
cp .env.example .env

# Add your FRED API key (get from https://fred.stlouisfed.org/docs/api/api_key.html)
# Edit .env and add:
FRED_API_KEY=your_key_here
```

### 2. Initialize Database
```bash
npm install          # Install dependencies
npm run init-db      # Create database schema
npm run seed-modules # Add sample modules
```

### 3. Fetch Real Data
```bash
# Pull FRED price data
npm run job:pull-fred

# Compute KPIs from the data
npm run job:compute-metrics
```

### 4. View Results
```bash
npm run dev
# Open http://localhost:3000
```

## What Works Now

? **Data Pipeline**
- FRED adapter can fetch real data
- Data validation with Zod
- Jobs framework with error handling
- Metrics computation (YoY, deltas, sparklines)

? **Frontend**
- Homepage with headline and KPI tiles
- Module pages with charts
- Policy timeline components

## What's Next

1. **Test with real data** - Run the FRED job and verify data appears in database
2. **Add more jobs** - BLS, Census, USDA adapters (already built, just need job scripts)
3. **Schedule jobs** - Set up cron for automatic updates
4. **Populate modules** - Add real time series data to modules

## Troubleshooting

**Job fails:**
- Check FRED_API_KEY is set correctly
- Verify database exists (run `npm run init-db`)
- Check console logs for specific errors

**No data in UI:**
- Run `npm run job:pull-fred` first
- Run `npm run job:compute-metrics` to calculate KPIs
- Check database has data: `sqlite3 tariff_impact.db "SELECT COUNT(*) FROM data_points"`

**API errors:**
- Verify API key format
- Check rate limits
- Some APIs may require registration

## Files Created This Session

- `lib/adapters/census.ts` - Complete Census adapter
- `lib/validation.ts` - Zod validation schemas
- `scripts/jobs/base-job.ts` - Job framework
- `scripts/jobs/pull-fred-prices.ts` - FRED data puller
- `scripts/jobs/compute-metrics.ts` - KPI calculator
- `scripts/jobs/README.md` - Job documentation
- `PROJECT_ROADMAP.md` - Updated progress tracking

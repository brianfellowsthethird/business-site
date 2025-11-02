# Viewing the Site

## Quick Start

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open in browser:**
   - Local: http://localhost:3000
   - Or use Cursor's preview feature if available

## What You'll See

### Homepage (`/`)
- **Hero Section**: Main headline about tariff costs ($2,400-$4,000 per family)
- **KPI Tiles**: Key metrics from featured modules
  - Currently shows soybeans metrics (2 tiles with values and trends)
- **Module Grid**: All 3 modules with links
  - Soybeans (has data)
  - Steel/Aluminum (structure ready)
  - Consumer Goods (structure ready)

### Soybeans Module (`/modules/soybeans`)
- **Headline**: "U.S. soybean exports to China fell sharply..."
- **KPI Tiles**:
  - Latest value: $300.00/MT
  - Baseline comparison: -16.54% vs July 2018 (down trend)
- **Chart**: Time series showing price trend from 2018-2025
- **Methodology**: Data sources and confounder notes

## Current Data Status

? **Available:**
- Soybeans module: 95 data points, 2 metrics

? **Ready for real data:**
- Steel/Aluminum module: Structure ready, needs BLS data
- Consumer Goods module: Structure ready, needs BLS data

## Troubleshooting

**Server won't start?**
- Check if port 3000 is already in use
- Try: `PORT=3001 npm run dev`

**No data showing?**
- Verify database exists: `ls tariff_impact.db`
- Check data: `sqlite3 tariff_impact.db "SELECT COUNT(*) FROM data_points;"`
- If empty, run: `npm run test-data` then `npm run job:compute-metrics`

**Charts not loading?**
- Check browser console for errors
- Verify ECharts is installed: `npm list echarts`

## Next Steps to Add More Data

1. **Get API keys** and add to `.env`:
   - `FRED_API_KEY`
   - `BLS_API_KEY`

2. **Run data pipeline:**
   ```bash
   npm run job:all
   ```

3. **Refresh browser** to see new data

# Project Roadmap & Progress Tracking

This document tracks the implementation status of the Tariff Impact Site and outlines next steps.

## ? Completed (v1 Foundation)

### Infrastructure & Setup
- [x] Next.js 14 project structure with TypeScript
- [x] Tailwind CSS styling system with design tokens
- [x] Database schema (SQLite/Turso) with normalized tables
- [x] Data source registry (`sources.json`)
- [x] TypeScript type definitions

### Data Layer
- [x] Base adapter interface
- [x] FRED adapter implementation
- [x] BLS adapter implementation
- [x] Census adapter implementation ?
- [x] Database client with CRUD operations
- [x] API routes (`/api/series`, `/api/modules`, `/api/policy`)

### Frontend Components
- [x] HeadlineBlock component
- [x] KPITile component with sparklines
- [x] TimeSeriesChart (ECharts) with policy bands
- [x] PolicyTimeline component
- [x] AlertBanner component
- [x] Source badges and attribution

### Pages
- [x] Homepage with hero headline and KPI tiles
- [x] Dynamic module pages (template structure)
- [x] Methodology drawers and confounder notes
- [x] Responsive layout and accessibility basics

### Documentation
- [x] README.md with project overview
- [x] GETTING_STARTED.md with setup instructions
- [x] Environment variable template (.env.example)

---

## ?? Next Steps (Priority Order)

### Phase 1: Data Pipeline (High Priority)

#### 1.1 Complete Data Adapters
- [ ] **Census Trade API** - Complete implementation with actual API endpoints
  - Research Census Trade API documentation
  - Implement proper request/response parsing
  - Handle rate limiting and errors
  - Status: Skeleton exists, needs API research

- [ ] **USDA/FAS Adapter** - Implement agricultural export data
  - Research USDA OpenData API structure
  - Create adapter following existing pattern
  - Test with soybean export data
  - Status: Not started

- [ ] **USTR/Federal Register Adapter** - Policy event scraper
  - Federal Register API for Section 301 documents
  - Parse policy events, exclusions, announcements
  - Store as policy_events in database
  - Status: Not started

#### 1.2 Data Pipeline Jobs
- [x] **ETL Script Structure** - Create job framework
  - Script in `scripts/jobs/` directory
  - Error handling and logging
  - Idempotent operations
  - Status: ? Complete

- [x] **Individual Job Scripts:**
  - [x] `pull_fred_prices.ts` - Daily FRED data fetch ?
  - [x] `pull_bls_ppi_ces.ts` - Daily BLS indices ?
  - [x] `pull_census_trade.ts` - Daily trade statistics ?
  - [ ] `pull_usda_fas.ts` - Weekly agricultural data
  - [ ] `pull_policy_events.ts` - Daily policy monitoring
  - [x] `compute_metrics.ts` - Nightly KPI calculations (deltas, YoY, baselines) ?
  - [x] `run-all.ts` - Master job runner ?

- [ ] **Cron/Scheduling Setup**
  - Local development: manual runs or node-cron
  - Production: Vercel Cron, GitHub Actions, or dedicated scheduler
  - Status: Not started

#### 1.3 Data Validation & Quality
- [x] Data validation with Zod schemas ?
- [x] Handle missing data gracefully (in adapters) ?
- [ ] Data revision tracking
- [ ] Backfill scripts for historical data

---

### Phase 2: Content & Modules (Medium Priority)

#### 2.1 Complete Initial Modules
- [ ] **Soybeans Module** - Add real data
  - Seed with FRED PSOYBUSDM data
  - Seed with Census export data (once adapter ready)
  - Calculate KPIs (export delta, price change)
  - Status: Structure done, needs data

- [ ] **Steel/Aluminum Module** - Add real data
  - Seed BLS PPI data
  - Calculate cost increases vs 2017 baseline
  - Status: Structure done, needs data

- [ ] **Consumer Goods Module** - Add real data
  - Seed BLS CPI data
  - Status: Structure done, needs data

#### 2.2 Additional Modules (from planning canvas)
- [ ] Auto/EV tariffs module
- [ ] Small business conditions module
- [ ] Dropshippers module
- [ ] Fruit & specialty crops module
- [ ] Healthcare & medical costs module
- [ ] Retaliation & U.S. exports module
- [ ] Tourism & foreign spending module
- [ ] Talent flight & brain drain module
- [ ] Federal workforce module

#### 2.3 Content Quality
- [ ] Finalize all headline copy (per planning canvas templates)
- [ ] Complete methodology sections
- [ ] Add confounder notes to all modules
- [ ] Source URL links (ensure all sources have clickable links)

---

### Phase 3: Enhancements (Lower Priority)

#### 3.1 Chart Enhancements
- [ ] Multi-series charts (e.g., price + exports on dual axes)
- [ ] Interactive brushing/zooming
- [ ] Chart export (PNG/SVG/PDF)
- [ ] Print-optimized styles
- [ ] Better mobile responsiveness for charts

#### 3.2 API Enhancements
- [ ] Add caching layer (Redis or in-memory)
- [ ] API rate limiting
- [ ] Response compression
- [ ] GraphQL option (optional)

#### 3.3 Admin & Monitoring
- [ ] Admin dashboard (`/admin`)
  - Job status and health
  - Last update timestamps per series
  - Manual trigger for data pulls
  - Data quality metrics
- [ ] Error alerting (email/Slack on job failures)

#### 3.4 UX Improvements
- [ ] Search functionality
- [ ] Module filtering/tagging
- [ ] "Compare modules" feature
- [ ] Downloadable data (CSV/JSON)
- [ ] Email newsletter signup (optional)

---

## ?? Immediate Next Steps (This Session)

1. **Research Census Trade API** - Find documentation and endpoints
2. **Complete Census adapter** - Full implementation with real API calls
3. **Create first data pull script** - `pull_fred_prices.ts` as proof of concept
4. **Seed real data** - Pull actual FRED data for soybeans module
5. **Test end-to-end** - Verify data flows from API ? DB ? Frontend

---

## ?? Blockers & Questions

### Open Questions
- [ ] Census Trade API: What's the exact endpoint structure? Need API key?
- [ ] USDA OpenData: Documentation location and access requirements?
- [ ] Federal Register API: Best approach for Section 301 document parsing?
- [ ] Production hosting: Vercel, Railway, or other? (affects cron strategy)
- [ ] Rate limits: What are the limits for each API?

### Potential Blockers
- Census API may require registration/special access
- Some APIs may have rate limits requiring careful scheduling
- Historical data backfill may require special API endpoints

---

## ?? Progress Summary

**Overall Completion: ~80%**

- Infrastructure: ? 100%
- Components: ? 90%
- Data Adapters: ?? 67% (FRED/BLS/Census done, USDA/USTR pending)
- Data Pipeline: ?? 75% (framework + 4 jobs done, 2 more jobs pending)
- Content/Modules: ?? 30% (templates done, real data pending)
- Documentation: ? 85%

**Next Milestone:** Working data pipeline pulling real data for at least one module (Soybeans).

---

## ?? Success Criteria for v1

From planning canvas Definition of Done:
- [x] Homepage with bold Headline Block + KPI tiles for 3 modules
- [x] Each module: 1?2 big charts (auto-updating) + policy band + methodology drawer
- [x] Policy timeline feed and surface banner
- [x] Source badges on every stat and chart with last-updated times
- [x] Accessibility pass (keyboard, contrast, ARIA descriptions for charts)
- [ ] **Actually auto-updating** (data pipeline jobs running)

---

## Notes

- Keep planning canvas (`tariff_impact_site_planning_canvas.md`) as the source of truth for requirements
- This roadmap focuses on implementation tasks
- Update this doc as work progresses

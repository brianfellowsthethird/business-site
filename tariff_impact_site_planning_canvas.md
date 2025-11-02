# Tariff Impact Site — Planning Canvas

A living workspace to track topics, metrics, and visuals for a self‑updating website on U.S. business impacts from Trump‑era and new tariff policies.

---

## 0) Opening headline concept — Cost of Living & Macro Impact
- **Big headline:** *"Tariffs are costing American families between **$2,400 and $4,000** more per year and cutting U.S. GDP by up to **$200 billion**."*
- **Supporting macro stats:**
  - **Total global trade affected:** ~$1 trillion in goods now under tariff coverage.
  - **Estimated drag on U.S. GDP:** 0.5–1 percentage point annually (≈ $100–200 billion loss).
  - **Inflation contribution:** 0.4–0.8 percentage points added to CPI.
- **Visual idea:**
  - Full‑width hero chart: *Household cost* + *GDP loss* bars with YoY deltas.
  - Source footnote: *"Based on estimates from the Peterson Institute, Oxford Economics, and the Tax Foundation (2024–2025)."*
- **Supporting stat tiles:**
  - “+$X billion estimated GDP loss from tariff policies.”
  - “+$Y% average increase in consumer goods prices affected by tariffs.”
  - “+$Z% higher input costs for small U.S. manufacturers.”
- **Narrative subhead:** *Rising import taxes ripple through supply chains—raising prices, reducing exports, and slowing growth across sectors.* — Cost of Living Impact
- **Big headline:** *"Tariffs are costing American families between **$2,400 and $4,000** more per year."*
- **Visual idea:**
  - Full‑width hero chart showing **average household cost increase** with year‑over‑year deltas.
  - Source footnote: *"Based on independent economic analyses (e.g., Peterson Institute, Tax Foundation, 2024–2025)."*
- **Supporting stat tiles:**
  - “+X% average increase in consumer goods prices affected by tariffs.”
  - “+Y% higher input costs for small U.S. manufacturers.”
- **Narrative subhead:** *Rising import taxes ripple through supply chains, raising prices on everyday goods—from cars to clothing.*

---

## 1) Editorial pillars & guardrails
- **Mission:** Quantify who’s getting hurt, how much, and when—using public, reproducible data.
- **Tone:** **Punchy but precise.** Big, clear headlines supported by defensible stats and charts.
- **Provenance:** Every number links to its source and shows a last‑updated timestamp.
- **Causality caution:** Note confounders (weather, FX, supply shocks) on each module.
- **Legitimacy cues:** consistent typography, restrained palette, footnoted sources, data dictionary, and method notes.

---

## 2) v1 Modules (topics) — with metrics, visuals, sources, cadence

### A) China tariffs → U.S. agriculture (Soybeans)
*(existing)*

### B) China tariffs → Manufacturers (Steel/Aluminum input costs)
*(existing)*

### C) Consumer goods tariffs → Retail prices & imports
*(existing)*

### D) Auto/EV tariffs → parts & vehicles
*(existing)*

### E) Small business conditions (context module)
*(existing)*

### F) Policy timeline — Section 301 & exclusions (cross‑cutting)
*(existing)*

### G) Dropshippers & small e‑commerce importers
- **Headline:** *"Dropshippers importing from overseas face higher landed costs as small‑package exemptions vanish."*
- **KPIs**: avg. import duty for < $800 shipments; % increase in e‑commerce goods cost; small‑business import volume trend.
- **Visuals**: Line chart of small‑value import volume; bar of tariff rates pre/post policy.
- **Sources**: Census trade API (low‑value imports), industry reports, logistics company data.
- **Cadence**: Monthly; update with customs data.

### H) Fruit & specialty crops
- **Headline:** *"Fruit & nut growers face sharp export declines as retaliation targets U.S. produce."*
- **KPIs**: Export value change for key fruit/nut HS codes; state‑level losses; input cost index for orchards.
- **Visuals**: Dual‑axis chart of export value vs input costs; map of top impacted states.
- **Sources**: USDA, Census, trade association data.
- **Cadence**: Monthly.

### I) Healthcare & medical costs
- **Headline:** *"Tariffs on medical devices and supplies raise hospital costs and premiums."*
- **KPIs**: % increase in medical supply import cost; projected health‑insurance premium impact.
- **Visuals**: Line of import price index; overlay of premium growth.
- **Sources**: HealthAffairs, AHRMM, Census medical import data.
- **Cadence**: Quarterly.

### J) Retaliation & U.S. exports
- **Headline:** *"Foreign retaliation wipes out tens of billions in U.S. export revenue."*
- **KPIs**: Export losses due to retaliation ($ bn); % of exports covered by foreign tariffs.
- **Visuals**: Choropleth of state export vulnerability; bar of losses by sector.
- **Sources**: ITIF, Tax Foundation, Census exports.
- **Cadence**: Monthly.

### K) Tourism & foreign spending
- **Headline:** *"Inbound tourism drops, costing Americans up to $30 billion in lost spending."*
- **KPIs**: % decline in foreign arrivals; total tourism export revenue loss.
- **Visuals**: Line of arrivals by region; bar of lost spending by year.
- **Sources**: U.S. Travel Association, BEA, Forbes/FT/Al Jazeera coverage.
- **Cadence**: Quarterly.

### L) Talent flight & brain drain
- **Headline:** *"Visa limits drive away STEM talent, costing billions in innovation and jobs."*
- **KPIs**: Drop in international STEM enrollments (%); economic loss from student decline ($ bn); jobs at risk.
- **Visuals**: Line of international enrollment; bar of estimated losses.
- **Sources**: NAFSA, IEEE, OECD, Newsweek.
- **Cadence**: Annual.

### M) Federal workforce & public sector
- **Headline:** *"Tariff‑driven inflation erodes real wages for millions of federal and state workers."*
- **KPIs**: CPI‑adjusted federal wage index; government purchase cost increase; % budget strain from inflation.
- **Visuals**: Indexed wage vs CPI; bar of procurement cost growth.
- **Sources**: BLS, OMB, agency procurement data.
- **Cadence**: Quarterly.

> **Future module ideas:** housing construction cost escalation, port congestion, shipping & logistics firms, education sector funding losses.

---

## 3) Cross‑cutting visuals & components (reusable)
- **Headline Block** (per module):
  - **Pattern:** `What happened + to whom + by how much + when`.
  - **Examples:**
    - *Soybean exports to China fell **▼18% YoY** in **August 2025***
    - *Steel input costs are **▲12%** vs **2017 baseline***
  - **Subhead:** One‑sentence attribution ("Source: U.S. Census Trade API, updated Sep 15, 2025").
- **KPI Tiles**: Big number + ▲/▼ delta + period + tiny sparkline.
- **Chart Components (ECharts)**: minimalist grid, accessible tooltips, policy bands; click‑through to sources.
- **Methodology drawer**: What the metric means, confounders, links.
- **Provenance footnote**: Source link + as‑of timestamp (UTC) + refresh cadence.
- **Policy bands**: Shaded ranges by effective dates per module.
- **Alert banner**: When a policy event occurs, surface on home & relevant modules.

---

## 4) Data pipeline plan (no manual updates)
- **Adapters** (one per provider): FRED, BLS, Census, USDA/FAS, USTR/FedReg.
- **Storage**: Raw pulls (object store) + normalized tables (Postgres/Turso).
- **Jobs** (cron):
  - `pull_fred_prices` (daily)
  - `pull_bls_ppi_ces` (daily)
  - `pull_census_trade` (daily)
  - `pull_usda_fas` (weekly)
  - `pull_policy_events` (daily)
  - `compute_metrics` (nightly: deltas, rolling means, baselines)
- **APIs exposed to frontend**: `/api/series/:id`, `/api/modules/:slug`, `/api/policy`.
- **Integrity**: Each observation carries `source`, `period`, `units`, `as_of`, `revised`.

---

## 5) ECharts sketches (option blueprints)

### Data‑viz inspiration and style principles
- **Influences:** Nicolas Felton’s personal annual reports (clarity, rhythm, typographic hierarchy) and The New York Times Graphics team (elegant restraint, deep data sourcing, annotated storytelling).
- **Core principles:**
  - Let quantitative detail drive form—charts as reading experiences, not decoration.
  - Layer information: main metric → supporting context → annotation → source.
  - Use typography and whitespace to guide eye movement rather than heavy color.
  - Favor small multiples, proportional scales, and subtle animation for updates.
  - Include narrative callouts and short explanatory captions like NYT’s “story‑within‑a‑chart” model.
- **Implementation:**
  - Global CSS grid based on 8‑pt modular system.
  - Responsive typography: optical sizes for data labels and annotations.
  - Print‑ready export style (PDF/press kit) echoing Felton’s data‑book aesthetic.

### Global style defaults (legit look)
- Fonts: Inter/Source Sans for UI; Charter/Source Serif for headlines.
- Palette: Greyscale + single accent (blue) for emphasis; red/green solely for deltas.
- Grid: ample white space; 12‑col layout; 64px gutters on desktop.
- ECharts defaults: thin strokes (2px), subtle gridlines, axis labels in small caps, tooltips include **Value**, **YoY**, **MoM**, **Source**.
- Annotations: policy bands (light tint), event markers with links.

### Soybeans (price vs exports)
- **Series**: Line A = PSOYBUSDM (price), Line/Bar B = Exports to CN (USD).
- **Axes**: Left $/MT, Right $ millions.
- **Extras**: Band from 2018‑07‑06 → present (301 in force), markers for major policy events.
- **Interactions**: Brushed zoom, tooltip with YoY and MoM deltas, toggle RoW vs China.

### Steel/Aluminum PPIs (indexed)
- **Series**: Multiple lines indexed to 100 at 2017‑12.
- **Axes**: Left index.
- **Extras**: Release dots; hover table shows last 6 months.

### Retail categories (imports & CPI)
- **Series**: Grouped bars YoY import change by category, line overlay for CPI YoY.
- **Axes**: Left % change, right index level (optional).

### Policy timeline
- **Series**: Custom series with symbol markers and tooltips linking to notices.

---

## 6) Series catalog (starter list)
- **FRED**: `PSOYBUSDM` (soy price, monthly); auto/industrial production index.
- **Census Trade**: HS 1201 to CN; HS 72–73 (steel), HS 76 (aluminum); HS 85 (electronics), HS 94 (furniture), HS 84 (appliances/other machinery) — refine with exact codes.
- **BLS**: PPI steel/aluminum sub‑indexes; CPI furniture/appliances; CES manufacturing employment.
- **USDA/FAS**: Annual soy export summaries.
- **USTR/FedReg**: Section 301 events & exclusions.

---

## 7) Definition of Done (v1)
- ✅ **Homepage** with bold **Headline Block** + KPI tiles for 3 modules.
- ✅ Each module: 1–2 **big charts** (auto‑updating) + policy band + methodology drawer.
- ✅ Policy timeline feed and surface banner.
- ✅ **Source badges** on every stat and chart with last‑updated times.
- ✅ Accessibility pass (keyboard, contrast, ARIA descriptions for charts).

---

## 8) Claude handoff checklist (build roadmap)
- [ ] Create `sources.json` registry and adapter interfaces.
- [ ] Implement FRED, Census, BLS adapters; USDA & USTR next.
- [ ] Set up DB schema and ETL cron jobs.
- [ ] Write `/api` endpoints with caching.
- [ ] Build ECharts components with reusable option factories.
- [ ] Ship Soybeans page as the template for other modules.
- [ ] Add Policy timeline; wire alert banner.
- [ ] Add copy for methodology/caveats; QA tooltips & legends.
- [ ] Add simple admin “status” view for job health and last updates.

---

## 9) Module summary table (A–M)

| ID | Topic | Headline summary | Key KPI(s) | Main Data Source(s) |
|----|--------|------------------|-------------|---------------------|
| A | Soybeans | U.S. soybean exports to China falling sharply | Export value to China, global soy price | FRED, USDA, Census |
| B | Steel/Aluminum | Input costs for U.S. manufacturers rising | PPI for steel/aluminum, import volumes | BLS, Census |
| C | Consumer goods | Retail prices rising for tariffed imports | CPI furniture/appliances, import values | BLS, Census |
| D | Auto/EV | EV and parts imports hit by tariffs | Import value of vehicles/batteries | Census, FRED |
| E | Small business | Optimism and formation decline | NFIB index, business formations | FRED, Census |
| F | Policy timeline | Chronology of Section 301 tariffs | Policy events, exclusions | USTR, Federal Register |
| G | Dropshippers | Small importers face higher landed costs | Avg. import duty, low‑value import trend | Census, logistics reports |
| H | Fruit & specialty crops | Growers face retaliation losses | Export value for fruits/nuts | USDA, Census |
| I | Healthcare | Medical costs & premiums up | Import price index, premium index | HealthAffairs, AHRMM, Census |
| J | Retaliation & exports | Retaliatory tariffs slash export revenue | Export losses, exposure % | ITIF, Tax Foundation, Census |
| K | Tourism | Foreign arrivals down, lost spending | Visitor arrivals %, lost revenue $ | BEA, U.S. Travel Assoc. |
| L | Talent flight | Fewer STEM students & skilled workers | STEM enrollment drop, $ loss | NAFSA, IEEE, OECD |
| M | Federal workforce | Inflation erodes real wages | CPI‑adjusted wage index | BLS, OMB |

---

## 9) Notes & open questions
- Which HS codes to lock for v1 in retail categories? (list candidates)
- Do we include state‑level export exposure maps in v1 or wait?
- Should we index some series to a common baseline (e.g., 2017=100) for comparability?
- Consider a “How to read this chart” pattern for non‑experts.

---

## 10) Headline & copy system (ready‑to‑fill)

### A. Templates
1. **Impact** — `{{Thing}} {{rose/fell}} **{{delta}}** {{period}}`  
   *Example:* *Soybean exports to China fell **18%** year‑over‑year.*
2. **Rank** — `{{Place/Sector}} is now **#{{rank}}** for {{metric}}`  
   *Example:* *Illinois is now **#2** in lost soy exports since 2018.*
3. **Since‑policy** — `Since {{policy start}}, {{metric}} is **{{delta}}**`  
   *Example:* *Since Section 301 began, steel input costs are **+12%**.*

### B. Microcopy rules
- Use **exact periods** (e.g., *August 2025*, not “recently”).
- Always pair a stat with a **source badge**.
- Prefer **percent change** + **absolute value** where space permits.

### C. Source badge pattern
- `Source: {{Agency}} • {{Series/Release}} • Updated {{YYYY‑MM‑DD}} • [View]`
- Clicks open the exact API/release page in a new tab.

---

## 12) Legal and ethical safeguards
- **Data use:** All statistics derive from public U.S. government sources (FRED, BLS, Census, USDA, USTR, etc.) or well-known research institutions. These works are public domain and open for reuse.
- **Attribution:** Every visualization must cite its source and update date.
- **Tone & claims:** Avoid opinionated or defamatory framing. State facts, cite sources, and separate any commentary under an "Analysis" label.
- **Disclaimer text (for footer):**
  > “All data displayed are from publicly available government and research sources. Visualizations are for informational purposes only and do not represent personal or partisan opinions.”
- **Liability protection:** Host via an LLC or project entity; keep documentation of data sources; maintain neutrality in copy.
- **Review process:** Before publication, verify accuracy of each figure and ensure copy avoids implied intent or motive.

### Legal checklist before publishing each module
1. ✅ **Source check:** Confirm every data point comes from a public or properly licensed dataset.
2. ✅ **Attribution:** Include full source, date, and URL (or API reference) under each chart.
3. ✅ **Accuracy:** Verify calculations (e.g., YoY %, averages) against the raw data.
4. ✅ **Tone:** Review text for neutrality—no intent, motive, or partisan statements.
5. ✅ **Context:** Ensure caveats/confounders are visible (weather, FX, global demand, etc.).
6. ✅ **Disclaimer:** Confirm footer disclaimer is active and visible.
7. ✅ **Documentation:** Save source files or API responses in project repo for audit trail.
8. ✅ **Entity protection:** Publish under project/LLC identity, not personal names.
9. ✅ **Legal review (if needed):** If adding commentary, consult media/First Amendment counsel.

---

## 11) Visual hierarchy & layout
- **Hero**: Headline Block (max 2 lines) + subhead + CTA.
- **KPI Row**: 3–6 tiles with tiny sparklines.
- **Primary Chart**: Tall, 16:9 on desktop; collapses to 4:3 on mobile.
- **Policy Timeline**: Below charts; shows latest 3 items inline.
- **Methods & Sources**: Accordion at bottom; persistent source badges on each element.


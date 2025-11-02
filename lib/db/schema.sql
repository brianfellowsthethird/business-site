-- Time series data storage
CREATE TABLE IF NOT EXISTS time_series (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  source TEXT NOT NULL,
  units TEXT NOT NULL,
  frequency TEXT NOT NULL,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Data points
CREATE TABLE IF NOT EXISTS data_points (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  series_id TEXT NOT NULL,
  date DATE NOT NULL,
  value REAL NOT NULL,
  source TEXT NOT NULL,
  period TEXT NOT NULL,
  units TEXT NOT NULL,
  as_of TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  revised BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (series_id) REFERENCES time_series(id),
  UNIQUE(series_id, date)
);

-- Metrics (computed KPIs)
CREATE TABLE IF NOT EXISTS metrics (
  id TEXT PRIMARY KEY,
  module_id TEXT NOT NULL,
  name TEXT NOT NULL,
  value REAL NOT NULL,
  delta REAL,
  delta_percent REAL,
  period TEXT NOT NULL,
  trend TEXT CHECK(trend IN ('up', 'down', 'stable')),
  sparkline_data TEXT, -- JSON array
  source TEXT NOT NULL,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Policy events
CREATE TABLE IF NOT EXISTS policy_events (
  id TEXT PRIMARY KEY,
  date DATE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  source_url TEXT,
  type TEXT NOT NULL CHECK(type IN ('tariff', 'exclusion', 'retaliation', 'other')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Module metadata
CREATE TABLE IF NOT EXISTS modules (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  headline TEXT NOT NULL,
  subhead TEXT,
  methodology TEXT,
  confounders TEXT, -- JSON array
  policy_band_start DATE,
  policy_band_end DATE,
  policy_band_label TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Module-series mapping
CREATE TABLE IF NOT EXISTS module_series (
  module_id TEXT NOT NULL,
  series_id TEXT NOT NULL,
  PRIMARY KEY (module_id, series_id),
  FOREIGN KEY (module_id) REFERENCES modules(id),
  FOREIGN KEY (series_id) REFERENCES time_series(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_data_points_series_date ON data_points(series_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_metrics_module ON metrics(module_id);
CREATE INDEX IF NOT EXISTS idx_policy_events_date ON policy_events(date DESC);
CREATE INDEX IF NOT EXISTS idx_data_points_as_of ON data_points(as_of);

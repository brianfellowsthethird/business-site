import { createClient } from '@libsql/client';
import type { DataPoint, TimeSeries, KPIMetric, PolicyEvent, Module } from '../types';

const getDatabaseUrl = () => {
  // Use Turso for production, SQLite for local dev
  if (process.env.TURSO_DATABASE_URL) {
    return process.env.TURSO_DATABASE_URL;
  }
  // Default to local SQLite file in project root
  return 'file:tariff_impact.db';
};

const dbConfig: any = {
  url: getDatabaseUrl(),
};

if (process.env.TURSO_AUTH_TOKEN) {
  dbConfig.authToken = process.env.TURSO_AUTH_TOKEN;
}

export const db = createClient(dbConfig);

// Time Series operations
export async function insertTimeSeries(series: Omit<TimeSeries, 'data'>) {
  await db.execute({
    sql: `
      INSERT OR REPLACE INTO time_series (id, name, source, units, frequency, last_updated)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    args: [series.id, series.name, series.source, series.units, series.frequency, series.last_updated],
  });
}

export async function insertDataPoint(point: DataPoint, seriesId: string) {
  await db.execute({
    sql: `
      INSERT OR REPLACE INTO data_points 
        (series_id, date, value, source, period, units, as_of, revised)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      seriesId,
      point.date,
      point.value,
      point.source,
      point.period,
      point.units,
      point.as_of,
      point.revised || false,
    ],
  });
}

export async function getTimeSeries(seriesId: string): Promise<TimeSeries | null> {
  const seriesResult = await db.execute({
    sql: 'SELECT * FROM time_series WHERE id = ?',
    args: [seriesId],
  });

  if (seriesResult.rows.length === 0) return null;

  const seriesRow = seriesResult.rows[0];
  const pointsResult = await db.execute({
    sql: `
      SELECT date, value, source, period, units, as_of, revised
      FROM data_points
      WHERE series_id = ?
      ORDER BY date ASC
    `,
    args: [seriesId],
  });

  const data: DataPoint[] = pointsResult.rows.map((row: any) => ({
    date: row.date as string,
    value: row.value as number,
    source: row.source as string,
    period: row.period as string,
    units: row.units as string,
    as_of: row.as_of as string,
    revised: Boolean(row.revised),
  }));

  return {
    id: seriesRow.id as string,
    name: seriesRow.name as string,
    data,
    units: seriesRow.units as string,
    frequency: seriesRow.frequency as string,
    source: seriesRow.source as string,
    last_updated: seriesRow.last_updated as string,
  };
}

// Metrics operations
export async function upsertMetric(metric: KPIMetric, moduleId: string) {
  await db.execute({
    sql: `
      INSERT OR REPLACE INTO metrics 
        (id, module_id, name, value, delta, delta_percent, period, trend, sparkline_data, source, last_updated)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      metric.id,
      moduleId,
      metric.id, // using id as name for now
      metric.value,
      metric.delta ?? null,
      metric.delta_percent ?? null,
      metric.period,
      metric.trend ?? null,
      metric.sparkline ? JSON.stringify(metric.sparkline) : null,
      metric.source,
      metric.last_updated,
    ],
  });
}

export async function getModuleMetrics(moduleId: string): Promise<KPIMetric[]> {
  const result = await db.execute({
    sql: 'SELECT * FROM metrics WHERE module_id = ? ORDER BY name',
    args: [moduleId],
  });

  return result.rows.map((row: any) => ({
    id: row.id as string,
    value: row.value as number,
    delta: row.delta as number | undefined,
    delta_percent: row.delta_percent as number | undefined,
    period: row.period as string,
    trend: row.trend as 'up' | 'down' | 'stable' | undefined,
    sparkline: row.sparkline_data ? JSON.parse(row.sparkline_data) : undefined,
    source: row.source as string,
    last_updated: row.last_updated as string,
  }));
}

// Policy events
export async function insertPolicyEvent(event: PolicyEvent) {
  await db.execute({
    sql: `
      INSERT OR REPLACE INTO policy_events (id, date, title, description, source_url, type)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    args: [event.id, event.date, event.title, event.description, event.source_url || null, event.type],
  });
}

export async function getPolicyEvents(limit = 10): Promise<PolicyEvent[]> {
  const result = await db.execute({
    sql: 'SELECT * FROM policy_events ORDER BY date DESC LIMIT ?',
    args: [limit],
  });

  return result.rows.map((row: any) => ({
    id: row.id as string,
    date: row.date as string,
    title: row.title as string,
    description: row.description as string,
    source_url: row.source_url as string | undefined,
    type: row.type as PolicyEvent['type'],
  }));
}

// Modules
export async function insertModule(module: Module) {
  await db.execute({
    sql: `
      INSERT OR REPLACE INTO modules 
        (id, slug, title, headline, subhead, methodology, confounders, 
         policy_band_start, policy_band_end, policy_band_label)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      module.id,
      module.slug,
      module.title,
      module.headline,
      module.subhead || null,
      module.methodology || null,
      module.confounders ? JSON.stringify(module.confounders) : null,
      module.policy_band?.start || null,
      module.policy_band?.end || null,
      module.policy_band?.label || null,
    ],
  });

  // Insert module-series mappings
  // Note: Series may not exist yet, so we'll create placeholder entries or skip FK check
  // The series will be created when data is first pulled
  for (const seriesId of module.series) {
    try {
      await db.execute({
        sql: 'INSERT OR IGNORE INTO module_series (module_id, series_id) VALUES (?, ?)',
        args: [module.id, seriesId],
      });
    } catch (error: any) {
      // If foreign key fails, create a placeholder time_series entry
      if (error?.message?.includes('FOREIGN KEY')) {
        await db.execute({
          sql: 'INSERT OR IGNORE INTO time_series (id, name, source, units, frequency, last_updated) VALUES (?, ?, ?, ?, ?, ?)',
          args: [seriesId, seriesId, 'Pending', 'N/A', 'Monthly', new Date().toISOString()],
        });
        // Retry the module_series insert
        await db.execute({
          sql: 'INSERT OR IGNORE INTO module_series (module_id, series_id) VALUES (?, ?)',
          args: [module.id, seriesId],
        });
      } else {
        throw error;
      }
    }
  }
}

export async function getModule(slug: string): Promise<Module | null> {
  const moduleResult = await db.execute({
    sql: 'SELECT * FROM modules WHERE slug = ?',
    args: [slug],
  });

  if (moduleResult.rows.length === 0) return null;

  const row = moduleResult.rows[0];
  const seriesResult = await db.execute({
    sql: 'SELECT series_id FROM module_series WHERE module_id = ?',
    args: [row.id],
  });

  const series = seriesResult.rows.map((r: any) => r.series_id as string);
  const kpis = await getModuleMetrics(row.id as string);

  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    headline: row.headline as string,
    subhead: row.subhead as string | undefined,
    kpis,
    series,
    policy_band: row.policy_band_start
      ? {
          start: row.policy_band_start as string,
          end: (row.policy_band_end as string) || undefined,
          label: row.policy_band_label as string,
        }
      : undefined,
    methodology: row.methodology as string | undefined,
    confounders: row.confounders ? JSON.parse(row.confounders) : undefined,
  };
}

export async function getAllModules(): Promise<Module[]> {
  const result = await db.execute({
    sql: 'SELECT slug FROM modules ORDER BY id',
  });

  const modules = [];
  for (const row of result.rows) {
    const module = await getModule(row.slug as string);
    if (module) modules.push(module);
  }
  return modules;
}

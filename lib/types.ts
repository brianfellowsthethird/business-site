export interface DataPoint {
  date: string;
  value: number;
  source: string;
  period: string;
  units: string;
  as_of: string;
  revised?: boolean;
}

export interface TimeSeries {
  id: string;
  name: string;
  data: DataPoint[];
  units: string;
  frequency: string;
  source: string;
  last_updated: string;
}

export interface KPIMetric {
  id: string;
  value: number;
  delta?: number;
  delta_percent?: number;
  period: string;
  trend?: 'up' | 'down' | 'stable';
  sparkline?: number[];
  source: string;
  last_updated: string;
}

export interface Module {
  id: string;
  slug: string;
  title: string;
  headline: string;
  subhead?: string;
  kpis: KPIMetric[];
  series: string[];
  policy_band?: {
    start: string;
    end?: string;
    label: string;
  };
  methodology?: string;
  confounders?: string[];
}

export interface PolicyEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  source_url?: string;
  affected_modules?: string[];
  type: 'tariff' | 'exclusion' | 'retaliation' | 'other';
}

export interface SourceConfig {
  name: string;
  baseUrl: string;
  apiKey?: string;
  cadence: string;
  series: Record<string, any>;
}

export interface Adapter {
  fetchSeries(seriesId: string, config: SourceConfig): Promise<TimeSeries>;
  fetchLatest(seriesId: string, config: SourceConfig): Promise<DataPoint>;
}

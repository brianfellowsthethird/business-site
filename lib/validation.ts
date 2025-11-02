import { z } from 'zod';

// DataPoint validation schema
export const DataPointSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  value: z.number().finite(),
  source: z.string().min(1),
  period: z.string(),
  units: z.string(),
  as_of: z.string().datetime(),
  revised: z.boolean().optional(),
});

// TimeSeries validation schema
export const TimeSeriesSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  data: z.array(DataPointSchema).min(0),
  units: z.string(),
  frequency: z.string(),
  source: z.string(),
  last_updated: z.string().datetime(),
});

// KPIMetric validation schema
export const KPIMetricSchema = z.object({
  id: z.string().min(1),
  value: z.number().finite(),
  delta: z.number().finite().optional(),
  delta_percent: z.number().finite().optional(),
  period: z.string(),
  trend: z.enum(['up', 'down', 'stable']).optional(),
  sparkline: z.array(z.number()).optional(),
  source: z.string(),
  last_updated: z.string().datetime(),
});

// PolicyEvent validation schema
export const PolicyEventSchema = z.object({
  id: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  title: z.string().min(1),
  description: z.string().optional(),
  source_url: z.string().url().optional(),
  type: z.enum(['tariff', 'exclusion', 'retaliation', 'other']),
});

// Validation helpers
export function validateDataPoint(point: unknown): asserts point is z.infer<typeof DataPointSchema> {
  DataPointSchema.parse(point);
}

export function validateTimeSeries(series: unknown): asserts series is z.infer<typeof TimeSeriesSchema> {
  TimeSeriesSchema.parse(series);
}

export function validateKPIMetric(metric: unknown): asserts metric is z.infer<typeof KPIMetricSchema> {
  KPIMetricSchema.parse(metric);
}

export function validatePolicyEvent(event: unknown): asserts event is z.infer<typeof PolicyEventSchema> {
  PolicyEventSchema.parse(event);
}

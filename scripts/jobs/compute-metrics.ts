import { BaseJob } from './base-job';
import { getTimeSeries, upsertMetric, getAllModules } from '@/lib/db/client';
import type { KPIMetric } from '@/lib/types';
import { format, subMonths, subYears } from 'date-fns';

/**
 * Job to compute KPIs and metrics from time series data
 * Runs nightly to calculate deltas, YoY changes, baselines, etc.
 */
export class ComputeMetricsJob extends BaseJob {
  constructor() {
    super('compute-metrics');
  }

  async execute(): Promise<void> {
    const modules = await getAllModules();
    console.log(`[${this.jobName}] Computing metrics for ${modules.length} modules`);

    for (const module of modules) {
      try {
        console.log(`[${this.jobName}] Processing module: ${module.slug}`);
        
        for (const seriesId of module.series) {
          try {
            const series = await getTimeSeries(seriesId);
            if (!series || series.data.length === 0) {
              console.log(`[${this.jobName}] Skipping ${seriesId} - no data available`);
              continue;
            }

            // Compute metrics for this series
            const metrics = this.computeSeriesMetrics(series, module);
            
            // Store metrics
            for (const metric of metrics) {
              await upsertMetric(metric, module.id);
            }

            console.log(`[${this.jobName}] Computed ${metrics.length} metrics for ${seriesId}`);
          } catch (error: any) {
            console.error(`[${this.jobName}] Error computing metrics for ${seriesId}:`, error.message);
          }
        }
      } catch (error: any) {
        console.error(`[${this.jobName}] Error processing module ${module.slug}:`, error.message);
      }
    }

    console.log(`[${this.jobName}] Completed computing all metrics`);
  }

  private computeSeriesMetrics(series: any, module: any): KPIMetric[] {
    const metrics: KPIMetric[] = [];
    const data = series.data;

    if (data.length === 0) return metrics;

    // Get latest value
    const latest = data[data.length - 1];
    const latestDate = new Date(latest.date);

    // Calculate YoY change
    const oneYearAgo = subYears(latestDate, 1);
    const yearAgoValue = this.findNearestValue(data, oneYearAgo.toISOString().split('T')[0]);
    
    // Calculate MoM change
    const oneMonthAgo = subMonths(latestDate, 1);
    const monthAgoValue = this.findNearestValue(data, oneMonthAgo.toISOString().split('T')[0]);

    // Calculate baseline change (if policy_band exists)
    let baselineValue: number | undefined;
    if (module.policy_band?.start) {
      const baselineDate = new Date(module.policy_band.start);
      baselineValue = this.findNearestValue(data, baselineDate.toISOString().split('T')[0]);
    }

    // Generate sparkline (last 12 months)
    const sparkline = this.generateSparkline(data, 12);

    // Main value metric
    const delta = yearAgoValue ? latest.value - yearAgoValue : undefined;
    const deltaPercent = yearAgoValue ? ((latest.value - yearAgoValue) / yearAgoValue) * 100 : undefined;
    const trend = deltaPercent
      ? deltaPercent > 1
        ? 'up'
        : deltaPercent < -1
        ? 'down'
        : 'stable'
      : undefined;

    metrics.push({
      id: `${series.id}_latest`,
      value: latest.value,
      delta,
      delta_percent: deltaPercent,
      period: `YoY to ${format(latestDate, 'MMM yyyy')}`,
      trend,
      sparkline,
      source: series.source,
      last_updated: series.last_updated,
    });

    // Baseline comparison if available
    if (baselineValue !== undefined) {
      const baselineDelta = latest.value - baselineValue;
      const baselineDeltaPercent = (baselineDelta / baselineValue) * 100;
      const baselineTrend = baselineDeltaPercent > 5 ? 'up' : baselineDeltaPercent < -5 ? 'down' : 'stable';

      metrics.push({
        id: `${series.id}_baseline`,
        value: latest.value,
        delta: baselineDelta,
        delta_percent: baselineDeltaPercent,
        period: `vs ${format(new Date(module.policy_band.start), 'MMM yyyy')} baseline`,
        trend: baselineTrend,
        source: series.source,
        last_updated: series.last_updated,
      });
    }

    return metrics;
  }

  private findNearestValue(data: any[], targetDate: string): number | undefined {
    // Find closest data point to target date
    const target = new Date(targetDate);
    let closest: any = null;
    let minDiff = Infinity;

    for (const point of data) {
      const pointDate = new Date(point.date);
      const diff = Math.abs(pointDate.getTime() - target.getTime());
      if (diff < minDiff) {
        minDiff = diff;
        closest = point;
      }
    }

    return closest?.value;
  }

  private generateSparkline(data: any[], months: number): number[] {
    // Get last N data points (monthly frequency assumed)
    const recent = data.slice(-months);
    return recent.map((d) => d.value);
  }
}

// Allow direct execution
if (require.main === module) {
  const job = new ComputeMetricsJob();
  job.run()
    .then((result) => {
      if (result.success) {
        console.log('Job completed successfully');
        process.exit(0);
      } else {
        console.error('Job failed:', result.error);
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

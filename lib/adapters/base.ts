import type { Adapter, TimeSeries, DataPoint, SourceConfig } from '../types';

export abstract class BaseAdapter implements Adapter {
  abstract fetchSeries(seriesId: string, config: SourceConfig): Promise<TimeSeries>;
  abstract fetchLatest(seriesId: string, config: SourceConfig): Promise<DataPoint>;

  protected getApiKey(config: SourceConfig): string {
    if (!config.apiKey) {
      throw new Error(`API key required for ${config.name}`);
    }
    // Replace environment variable placeholders
    const key = config.apiKey.replace(/\$\{(\w+)\}/g, (_, varName) => {
      const envValue = process.env[varName];
      if (!envValue) {
        throw new Error(`Environment variable ${varName} not set`);
      }
      return envValue;
    });
    return key;
  }

  protected formatDate(date: Date | string): string {
    if (typeof date === 'string') return date;
    return date.toISOString().split('T')[0];
  }

  protected calculateDelta(current: number, previous: number): number {
    return current - previous;
  }

  protected calculateDeltaPercent(current: number, previous: number): number {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }
}

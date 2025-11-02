import { BaseAdapter } from './base';
import type { TimeSeries, DataPoint, SourceConfig } from '../types';

export class FREDAdapter extends BaseAdapter {
  async fetchSeries(seriesId: string, config: SourceConfig): Promise<TimeSeries> {
    const apiKey = this.getApiKey(config);
    const url = `${config.baseUrl}/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`FRED API error: ${response.statusText}`);
    }

    const data = await response.json();
    const seriesInfo = data.seriess?.[0];
    const observations = data.observations || [];

    const dataPoints: DataPoint[] = observations
      .filter((obs: any) => obs.value !== '.')
      .map((obs: any) => ({
        date: obs.date,
        value: parseFloat(obs.value),
        source: 'FRED',
        period: obs.date,
        units: seriesInfo?.units || 'Index',
        as_of: new Date().toISOString(),
        revised: false,
      }));

    return {
      id: seriesId,
      name: seriesInfo?.title || seriesId,
      data: dataPoints,
      units: seriesInfo?.units || 'Index',
      frequency: seriesInfo?.frequency || 'Monthly',
      source: 'FRED',
      last_updated: new Date().toISOString(),
    };
  }

  async fetchLatest(seriesId: string, config: SourceConfig): Promise<DataPoint> {
    const apiKey = this.getApiKey(config);
    const url = `${config.baseUrl}/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&limit=1&sort_order=desc`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`FRED API error: ${response.statusText}`);
    }

    const data = await response.json();
    const observation = data.observations?.[0];
    
    if (!observation || observation.value === '.') {
      throw new Error(`No latest data available for ${seriesId}`);
    }

    return {
      date: observation.date,
      value: parseFloat(observation.value),
      source: 'FRED',
      period: observation.date,
      units: data.seriess?.[0]?.units || 'Index',
      as_of: new Date().toISOString(),
      revised: false,
    };
  }
}

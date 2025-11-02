import { BaseAdapter } from './base';
import type { TimeSeries, DataPoint, SourceConfig } from '../types';

export class BLSAdapter extends BaseAdapter {
  async fetchSeries(seriesId: string, config: SourceConfig): Promise<TimeSeries> {
    const apiKey = this.getApiKey(config);
    const seriesConfig = config.series[seriesId];
    if (!seriesConfig) {
      throw new Error(`Series ${seriesId} not found in config`);
    }

    // Calculate date range (BLS API typically needs start and end year)
    const endYear = new Date().getFullYear();
    const startYear = endYear - 5; // Get 5 years of data

    const url = `${config.baseUrl}/timeseries/data/`;
    
    const requestBody = {
      seriesid: [seriesConfig.id || seriesId],
      startyear: startYear.toString(),
      endyear: endYear.toString(),
      registrationkey: apiKey,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`BLS API error: ${response.statusText}`);
    }

    const data = await response.json();
    const seriesData = data.Results?.series?.[0]?.data || [];

    const dataPoints: DataPoint[] = seriesData
      .map((item: any) => ({
        date: `${item.year}-${item.period.substring(1)}-01`, // BLS period format like "M01"
        value: parseFloat(item.value),
        source: 'BLS',
        period: `${item.year}-${item.period}`,
        units: seriesConfig.units || 'Index',
        as_of: new Date().toISOString(),
        revised: item.period === 'R1', // BLS marks revisions
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      id: seriesId,
      name: seriesConfig.name,
      data: dataPoints,
      units: seriesConfig.units || 'Index',
      frequency: seriesConfig.frequency || 'Monthly',
      source: 'BLS',
      last_updated: new Date().toISOString(),
    };
  }

  async fetchLatest(seriesId: string, config: SourceConfig): Promise<DataPoint> {
    const series = await this.fetchSeries(seriesId, config);
    if (series.data.length === 0) {
      throw new Error(`No data available for ${seriesId}`);
    }
    return series.data[series.data.length - 1];
  }
}

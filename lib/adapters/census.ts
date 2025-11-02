import { BaseAdapter } from './base';
import type { TimeSeries, DataPoint, SourceConfig } from '../types';

/**
 * Census Trade API Adapter
 * 
 * Note: Census Bureau Trade API structure varies by endpoint.
 * This implementation targets the timeseries/intltrade endpoint.
 * 
 * Documentation: https://www.census.gov/data/developers/data-sets/international-trade.html
 * 
 * The API requires:
 * - GET parameters: get, COMM_LVL, HS, time_from, time_to, etc.
 * - Some endpoints may require API key registration
 */
export class CensusAdapter extends BaseAdapter {
  async fetchSeries(seriesId: string, config: SourceConfig): Promise<TimeSeries> {
    const seriesConfig = config.series[seriesId];
    if (!seriesConfig) {
      throw new Error(`Series ${seriesId} not found in config`);
    }

    // Census Trade API endpoint structure
    // For exports: /data/timeseries/intltrade/exports
    // For imports: /data/timeseries/intltrade/imports
    const tradeType = seriesConfig.tradeType || 'exports';
    const endpoint = `${config.baseUrl}/${tradeType}`;

    // Build query parameters
    const params = new URLSearchParams({
      get: 'ALL_VAL_MO', // All trade values monthly
      COMM_LVL: seriesConfig.commodityLevel || 'HS6', // HS code level
      time_from: seriesConfig.startDate || '2020-01',
      time_to: this.getCurrentPeriod(),
    });

    // Add HS code if specified
    if (seriesConfig.hsCode) {
      params.append('HS', seriesConfig.hsCode.toString());
    }

    // Add country filter if specified
    if (seriesConfig.country) {
      params.append('CTY_CODE', seriesConfig.country);
    }

    const url = `${endpoint}?${params.toString()}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Census API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const dataPoints = this.parseCensusData(data, seriesConfig);

      return {
        id: seriesId,
        name: seriesConfig.name,
        data: dataPoints,
        units: seriesConfig.units,
        frequency: seriesConfig.frequency,
        source: 'Census',
        last_updated: new Date().toISOString(),
      };
    } catch (error: any) {
      // Handle common Census API issues
      if (error.message.includes('404')) {
        throw new Error(`Census endpoint not found. Verify API endpoint and parameters.`);
      }
      if (error.message.includes('429')) {
        throw new Error(`Census API rate limit exceeded. Please wait before retrying.`);
      }
      throw error;
    }
  }

  async fetchLatest(seriesId: string, config: SourceConfig): Promise<DataPoint> {
    const series = await this.fetchSeries(seriesId, config);
    if (series.data.length === 0) {
      throw new Error(`No data available for ${seriesId}`);
    }
    return series.data[series.data.length - 1];
  }

  private parseCensusData(data: any, config: any): DataPoint[] {
    // Census API returns data in various formats depending on endpoint
    // Common format: array of arrays where first row is headers
    
    if (!Array.isArray(data) || data.length === 0) {
      console.warn('Census API returned empty or invalid data');
      return [];
    }

    // Handle array-of-arrays format (common in Census API)
    if (Array.isArray(data[0])) {
      const headers = data[0] as string[];
      const timeIndex = headers.findIndex(h => 
        h.toLowerCase().includes('time') || 
        h.toLowerCase().includes('period') ||
        h.toLowerCase().includes('date')
      );
      const valueIndex = headers.findIndex(h => 
        h.toLowerCase().includes('val') || 
        h.toLowerCase().includes('value') ||
        h.toLowerCase().includes('trade')
      );

      if (timeIndex === -1 || valueIndex === -1) {
        throw new Error('Could not parse Census API response: missing time or value columns');
      }

      return data.slice(1).map((row: any[]) => {
        const dateStr = row[timeIndex] as string;
        const value = parseFloat(row[valueIndex] as string);
        
        // Convert Census period format (YYYY-MM) to date
        const date = this.parseCensusPeriod(dateStr);

        return {
          date,
          value: isNaN(value) ? 0 : value,
          source: 'Census',
          period: dateStr,
          units: config.units || 'USD',
          as_of: new Date().toISOString(),
          revised: false,
        };
      }).filter((point: DataPoint) => !isNaN(point.value));
    }

    // Handle object array format
    if (typeof data[0] === 'object') {
      return data.map((item: any) => {
        const dateStr = item.time || item.period || item.date;
        const value = parseFloat(item.value || item.ALL_VAL_MO || item.trade_value);

        return {
          date: this.parseCensusPeriod(dateStr),
          value: isNaN(value) ? 0 : value,
          source: 'Census',
          period: dateStr,
          units: config.units || 'USD',
          as_of: new Date().toISOString(),
          revised: false,
        };
      }).filter((point: DataPoint) => !isNaN(point.value));
    }

    throw new Error('Unsupported Census API response format');
  }

  private parseCensusPeriod(period: string): string {
    // Census periods can be in formats like:
    // "2020-01", "202001", "2020-01-01"
    // Convert to YYYY-MM-DD format
    if (period.includes('-') && period.length === 7) {
      // YYYY-MM format, assume first day of month
      return `${period}-01`;
    }
    if (period.length === 6) {
      // YYYYMM format
      return `${period.substring(0, 4)}-${period.substring(4, 6)}-01`;
    }
    // Already in YYYY-MM-DD format
    return period;
  }

  private getCurrentPeriod(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }
}

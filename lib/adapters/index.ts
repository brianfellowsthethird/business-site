import { FREDAdapter } from './fred';
import { CensusAdapter } from './census';
import { BLSAdapter } from './bls';
import type { Adapter, SourceConfig } from '../types';
import sources from '../../data/sources.json';

export function getAdapter(sourceType: string): Adapter {
  switch (sourceType) {
    case 'fred':
      return new FREDAdapter();
    case 'census':
      return new CensusAdapter();
    case 'bls':
      return new BLSAdapter();
    default:
      throw new Error(`Unknown adapter type: ${sourceType}`);
  }
}

export function getSourceConfig(sourceType: string): SourceConfig {
  const config = (sources as any)[sourceType];
  if (!config) {
    throw new Error(`Unknown source type: ${sourceType}`);
  }
  return config as SourceConfig;
}

export async function fetchSeriesFromSource(
  sourceType: string,
  seriesId: string
): Promise<any> {
  const adapter = getAdapter(sourceType);
  const config = getSourceConfig(sourceType);
  return adapter.fetchSeries(seriesId, config);
}

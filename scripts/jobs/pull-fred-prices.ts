import { BaseJob } from './base-job';
import { fetchSeriesFromSource } from '@/lib/adapters';
import { insertTimeSeries, insertDataPoint, getTimeSeries } from '@/lib/db/client';
import { validateTimeSeries } from '@/lib/validation';
import sources from '../../data/sources.json';

/**
 * Job to pull price data from FRED API
 * Runs daily to fetch latest economic indicators
 */
export class PullFredPricesJob extends BaseJob {
  constructor() {
    super('pull-fred-prices');
  }

  async execute(): Promise<void> {
    const fredConfig = (sources as any).fred;
    if (!fredConfig) {
      throw new Error('FRED configuration not found');
    }

    const seriesToFetch = Object.keys(fredConfig.series);
    console.log(`[${this.jobName}] Fetching ${seriesToFetch.length} FRED series`);

    for (const seriesId of seriesToFetch) {
      try {
        // Check if we should fetch (idempotency)
        const shouldFetch = await this.shouldFetch(seriesId);
        if (!shouldFetch) {
          console.log(`[${this.jobName}] Skipping ${seriesId} - recent data exists`);
          continue;
        }

        // Fetch from FRED API
        console.log(`[${this.jobName}] Fetching ${seriesId} from FRED...`);
        const series = await fetchSeriesFromSource('fred', seriesId);
        
        // Validate data
        validateTimeSeries(series);
        this.validateData(series);

        // Store in database
        await insertTimeSeries({
          id: series.id,
          name: series.name,
          source: series.source,
          units: series.units,
          frequency: series.frequency,
          last_updated: series.last_updated,
        });

        // Insert all data points
        let inserted = 0;
        for (const point of series.data) {
          try {
            await insertDataPoint(point, series.id);
            inserted++;
          } catch (error: any) {
            // Skip duplicate entries (unique constraint)
            if (!error.message?.includes('UNIQUE constraint')) {
              throw error;
            }
          }
        }

        this.logInsert(series.id, inserted);
        console.log(`[${this.jobName}] Successfully processed ${seriesId}`);
      } catch (error: any) {
        console.error(`[${this.jobName}] Error processing ${seriesId}:`, error.message);
        // Continue with other series even if one fails
      }
    }

    console.log(`[${this.jobName}] Completed fetching all FRED series`);
  }
}

// Allow direct execution
if (require.main === module) {
  const job = new PullFredPricesJob();
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

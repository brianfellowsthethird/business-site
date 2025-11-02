import type { TimeSeries } from '@/lib/types';

/**
 * Base class for ETL jobs
 * Provides common error handling, logging, and idempotency patterns
 */
export abstract class BaseJob {
  protected jobName: string;

  constructor(jobName: string) {
    this.jobName = jobName;
  }

  /**
   * Main execution method - override in subclasses
   */
  abstract execute(): Promise<void>;

  /**
   * Run the job with error handling and logging
   */
  async run(): Promise<{ success: boolean; error?: string; dataCount?: number }> {
    const startTime = Date.now();
    console.log(`[${this.jobName}] Starting job at ${new Date().toISOString()}`);

    try {
      await this.execute();
      const duration = Date.now() - startTime;
      console.log(`[${this.jobName}] Job completed successfully in ${duration}ms`);
      
      return { success: true };
    } catch (error: any) {
      const duration = Date.now() - startTime;
      console.error(`[${this.jobName}] Job failed after ${duration}ms:`, error);
      
      return {
        success: false,
        error: error.message || 'Unknown error',
      };
    }
  }

  /**
   * Log data insertion
   */
  protected logInsert(seriesId: string, count: number) {
    console.log(`[${this.jobName}] Inserted ${count} data points for series ${seriesId}`);
  }

  /**
   * Check if series exists and has recent data (idempotency check)
   */
  protected async shouldFetch(seriesId: string, minDataAgeHours = 6): Promise<boolean> {
    // This can be enhanced to check database for existing recent data
    // For now, always fetch
    return true;
  }

  /**
   * Validate data before insertion
   */
  protected validateData(data: TimeSeries): void {
    if (!data.data || data.data.length === 0) {
      throw new Error(`No data points in series ${data.id}`);
    }

    // Check for reasonable value ranges (can be customized per job)
    const values = data.data.map(d => d.value);
    const hasValidValues = values.every(v => isFinite(v) && !isNaN(v));
    
    if (!hasValidValues) {
      throw new Error(`Series ${data.id} contains invalid values`);
    }
  }
}

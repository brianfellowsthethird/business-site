import { PullFredPricesJob } from './pull-fred-prices';
import { PullBLSIndicesJob } from './pull-bls-ppi-ces';
import { PullCensusTradeJob } from './pull-census-trade';
import { ComputeMetricsJob } from './compute-metrics';

/**
 * Master script to run all data pipeline jobs in sequence
 * 
 * Usage: npm run job:all
 * 
 * Runs jobs in order:
 * 1. FRED prices
 * 2. BLS indices
 * 3. Census trade
 * 4. Compute metrics (after all data is pulled)
 */
async function runAllJobs() {
  console.log('='.repeat(60));
  console.log('Starting Data Pipeline - All Jobs');
  console.log('='.repeat(60));
  console.log('');

  const jobs = [
    { name: 'FRED Prices', job: new PullFredPricesJob() },
    { name: 'BLS Indices', job: new PullBLSIndicesJob() },
    { name: 'Census Trade', job: new PullCensusTradeJob() },
  ];

  const results: Array<{ name: string; success: boolean; error?: string }> = [];

  // Run data fetch jobs
  for (const { name, job } of jobs) {
    console.log(`\n[Master] Running ${name}...`);
    const result = await job.run();
    results.push({ name, success: result.success, error: result.error });
    
    if (!result.success) {
      console.log(`[Master] ??  ${name} completed with errors (may be missing API keys)`);
    } else {
      console.log(`[Master] ? ${name} completed successfully`);
    }
  }

  // Run metrics computation after all data jobs
  console.log('\n[Master] Computing metrics from all fetched data...');
  const metricsJob = new ComputeMetricsJob();
  const metricsResult = await metricsJob.run();
  results.push({
    name: 'Compute Metrics',
    success: metricsResult.success,
    error: metricsResult.error,
  });

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('Pipeline Summary');
  console.log('='.repeat(60));
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  results.forEach(({ name, success, error }) => {
    const status = success ? '?' : '?';
    console.log(`${status} ${name}${error ? ` - ${error.substring(0, 50)}` : ''}`);
  });

  console.log('');
  console.log(`Total: ${results.length} jobs | ? ${successful} successful | ? ${failed} failed`);
  console.log('='.repeat(60));

  // Exit with error code if any critical job failed
  // (Metrics failure is critical, data fetch failures may be due to missing keys)
  if (!metricsResult.success) {
    console.error('\n? Metrics computation failed - this is critical');
    process.exit(1);
  }

  if (failed > 0 && successful === 0) {
    console.error('\n??  All data fetch jobs failed - check API keys');
    process.exit(1);
  }

  console.log('\n? Pipeline completed');
  process.exit(0);
}

runAllJobs().catch((error) => {
  console.error('Fatal error in pipeline:', error);
  process.exit(1);
});

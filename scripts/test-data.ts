import { insertTimeSeries, insertDataPoint } from '../lib/db/client';
import type { DataPoint } from '../lib/types';

/**
 * Test script to add sample data for testing the pipeline
 * This creates mock FRED data for the soybeans module
 */
async function addTestData() {
  console.log('Adding test data for soybeans module...');

  // Create test series for PSOYBUSDM (soybean price)
  const seriesId = 'PSOYBUSDM';
  
  await insertTimeSeries({
    id: seriesId,
    name: 'Soybean Price (USD per Metric Ton)',
    source: 'FRED',
    units: 'USD/MT',
    frequency: 'Monthly',
    last_updated: new Date().toISOString(),
  });

  // Generate sample data points (monthly from 2018 to now)
  const startDate = new Date(2018, 0, 1); // January 2018
  const now = new Date();
  const dataPoints: DataPoint[] = [];

  // Simulate price trend: started at 350, dropped after tariffs, recovering
  let basePrice = 350;
  
  for (let date = new Date(startDate); date <= now; date.setMonth(date.getMonth() + 1)) {
    // Simulate price volatility with a downward trend after mid-2018
    const monthsSinceStart = (date.getFullYear() - 2018) * 12 + date.getMonth();
    
    // Price drop after tariffs started (July 2018)
    if (monthsSinceStart >= 6) {
      basePrice = 350 - (monthsSinceStart - 6) * 2 + Math.random() * 20 - 10;
    } else {
      basePrice = 350 + Math.random() * 20 - 10;
    }
    
    // Ensure price stays reasonable
    basePrice = Math.max(300, Math.min(400, basePrice));

    dataPoints.push({
      date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`,
      value: Math.round(basePrice * 100) / 100,
      source: 'FRED',
      period: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      units: 'USD/MT',
      as_of: new Date().toISOString(),
      revised: false,
    });
  }

  // Insert all data points
  let inserted = 0;
  for (const point of dataPoints) {
    try {
      await insertDataPoint(point, seriesId);
      inserted++;
    } catch (error: any) {
      if (!error?.message?.includes('UNIQUE constraint')) {
        throw error;
      }
    }
  }

  console.log(`Inserted ${inserted} data points for ${seriesId}`);
  console.log(`Date range: ${dataPoints[0].date} to ${dataPoints[dataPoints.length - 1].date}`);
  console.log('Test data added successfully!');
}

addTestData()
  .then(() => {
    console.log('Done');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed:', error);
    process.exit(1);
  });

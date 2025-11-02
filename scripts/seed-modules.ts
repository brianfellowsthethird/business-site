import { insertModule, insertTimeSeries, insertDataPoint } from '../lib/db/client';
import type { Module, TimeSeries } from '../lib/types';

// Sample data for initial modules
const sampleModules: Module[] = [
  {
    id: 'soybeans',
    slug: 'soybeans',
    title: 'China Tariffs ? U.S. Agriculture (Soybeans)',
    headline: 'U.S. soybean exports to China fell sharply after Section 301 tariffs took effect.',
    subhead: 'Retaliatory tariffs reduced demand for American soybeans, impacting farmers and rural economies.',
    kpis: [],
    series: ['PSOYBUSDM', 'soybeans_china'],
    policy_band: {
      start: '2018-07-06',
      label: 'Section 301 Tariffs',
    },
    methodology: 'Data tracks U.S. soybean export volumes and prices to China using FRED price data and Census trade statistics. Comparisons are made to pre-2018 baselines.',
    confounders: [
      'Weather conditions and crop yields',
      'Currency exchange rates',
      'Global demand for soybeans',
      'Alternative export markets',
    ],
  },
  {
    id: 'steel-aluminum',
    slug: 'steel-aluminum',
    title: 'China Tariffs ? Manufacturers (Steel/Aluminum)',
    headline: 'Input costs for U.S. manufacturers rose as tariffs increased prices for imported steel and aluminum.',
    subhead: 'Higher material costs ripple through supply chains, affecting competitiveness and consumer prices.',
    kpis: [],
    series: ['PPI_steel', 'PPI_aluminum', 'steel_imports', 'aluminum_imports'],
    policy_band: {
      start: '2018-03-23',
      label: 'Steel & Aluminum Tariffs',
    },
    methodology: 'Producer Price Index (PPI) data from BLS tracks cost changes for steel and aluminum inputs. Import volumes from Census show trade flow impacts.',
    confounders: [
      'Global steel and aluminum production capacity',
      'Energy costs affecting production',
      'Domestic production increases',
      'Substitution effects',
    ],
  },
  {
    id: 'consumer-goods',
    slug: 'consumer-goods',
    title: 'Consumer Goods Tariffs ? Retail Prices & Imports',
    headline: 'Retail prices rose for furniture, appliances, and other consumer goods affected by tariffs.',
    subhead: 'Tariffs on imports from China increased costs for everyday household items.',
    kpis: [],
    series: ['CPI_furniture', 'CPI_appliances'],
    policy_band: {
      start: '2018-09-24',
      label: 'Consumer Goods Tariffs (List 3)',
    },
    methodology: 'Consumer Price Index (CPI) data from BLS tracks retail price changes for furniture and appliances. Import value data from Census shows trade flow changes.',
    confounders: [
      'Supply chain disruptions',
      'Retailer pricing strategies',
      'Consumer demand shifts',
      'Alternative sourcing',
    ],
  },
];

async function seedModules() {
  try {
    console.log('Seeding modules...');

    for (const module of sampleModules) {
      await insertModule(module);
      console.log(`Inserted module: ${module.slug}`);
    }

    console.log('Modules seeded successfully');
  } catch (error) {
    console.error('Error seeding modules:', error);
    throw error;
  }
}

seedModules()
  .then(() => {
    console.log('Done');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed:', error);
    process.exit(1);
  });

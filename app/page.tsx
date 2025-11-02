import HeadlineBlock from '@/components/HeadlineBlock';
import KPITile from '@/components/KPITile';
import TimeSeriesChart from '@/components/charts/TimeSeriesChart';
import Link from 'next/link';
import { getAllModules } from '@/lib/db/client';
import { getPolicyEvents } from '@/lib/db/client';

async function getHomepageData() {
  try {
    // Fetch modules for homepage KPIs
    const modules = await getAllModules();

    // Fetch policy events for banner
    const events = await getPolicyEvents(3);

    return { modules, events };
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return { modules: [], events: [] };
  }
}

export default async function HomePage() {
  const { modules, events } = await getHomepageData();

  // Main headline from planning canvas
  const mainHeadline = "Tariffs are costing American families between $2,400 and $4,000 more per year and cutting U.S. GDP by up to $200 billion.";
  const mainSubhead = "Rising import taxes ripple through supply chains?raising prices, reducing exports, and slowing growth across sectors.";

  // Get first 3 modules for KPI display
  const featuredModules = modules.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-gutter py-6">
          <h1 className="text-2xl font-serif font-bold">Tariff Impact</h1>
          <p className="text-sm text-gray-600 mt-1">
            Economic data on U.S. tariff policy impacts
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-gutter py-8 md:py-12">
        {/* Hero Headline Block */}
        <HeadlineBlock
          headline={mainHeadline}
          subhead={mainSubhead}
          source="Peterson Institute, Oxford Economics, Tax Foundation (2024?2025)"
        />

        {/* Alert Banner for recent policy events */}
        {events.length > 0 && (
          <div className="bg-blue-50 border-l-4 border-accent p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-accent" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-accent-dark">
                  Latest Policy Update
                </p>
                <p className="mt-1 text-sm text-gray-700">
                  {events[0].title} ? {new Date(events[0].date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* KPI Tiles */}
        {featuredModules.length > 0 && (
          <section className="mb-12">
            <h2 className="text-headline mb-6">Key Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredModules.map((module: any) => (
                <div key={module.id}>
                  {module.kpis && module.kpis.length > 0 ? (
                    <KPITile metric={module.kpis[0]} />
                  ) : (
                    <div className="kpi-tile">
                      <div className="text-sm text-gray-600">{module.title}</div>
                      <div className="text-2xl font-bold mt-2">No data available</div>
                    </div>
                  )}
                  <Link
                    href={`/modules/${module.slug}`}
                    className="text-sm text-accent hover:text-accent-dark mt-2 block"
                  >
                    View module ?
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Featured Modules Grid */}
        <section className="mb-12">
          <h2 className="text-headline mb-6">Impact Areas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module: any) => (
              <Link
                key={module.id}
                href={`/modules/${module.slug}`}
                className="kpi-tile hover:shadow-lg transition-all"
              >
                <h3 className="text-xl font-serif font-bold mb-2">{module.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{module.headline}</p>
                {module.kpis && module.kpis.length > 0 && (
                  <div className="text-sm text-accent">View metrics ?</div>
                )}
              </Link>
            ))}
          </div>
        </section>

        {/* Methodology & Sources */}
        <section className="border-t border-gray-200 pt-8 mt-12">
          <details className="mb-4">
            <summary className="cursor-pointer text-lg font-medium text-gray-700 mb-4">
              Methodology & Data Sources
            </summary>
            <div className="prose prose-sm max-w-none mt-4">
              <p className="text-gray-600">
                All data displayed are from publicly available government and research sources. 
                Visualizations are for informational purposes only and do not represent personal 
                or partisan opinions.
              </p>
              <h3 className="text-base font-semibold mt-4 mb-2">Data Sources</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Federal Reserve Economic Data (FRED)</li>
                <li>U.S. Census Bureau Trade Data</li>
                <li>Bureau of Labor Statistics (BLS)</li>
                <li>USDA Foreign Agricultural Service</li>
                <li>U.S. Trade Representative / Federal Register</li>
              </ul>
              <h3 className="text-base font-semibold mt-4 mb-2">Note on Causality</h3>
              <p className="text-gray-600">
                Many factors influence economic indicators beyond tariff policies, including weather, 
                exchange rates, global demand, supply chain disruptions, and other market forces. 
                Each module includes contextual notes on potential confounders.
              </p>
            </div>
          </details>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-gutter py-8">
          <p className="text-sm text-gray-600">
            All data displayed are from publicly available government and research sources. 
            Visualizations are for informational purposes only and do not represent personal 
            or partisan opinions.
          </p>
        </div>
      </footer>
    </div>
  );
}

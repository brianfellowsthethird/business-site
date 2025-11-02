import { notFound } from 'next/navigation';
import HeadlineBlock from '@/components/HeadlineBlock';
import KPITile from '@/components/KPITile';
import TimeSeriesChart from '@/components/charts/TimeSeriesChart';
import Link from 'next/link';
import { getModule } from '@/lib/db/client';
import { getTimeSeries } from '@/lib/db/client';

async function getModuleWithData(slug: string) {
  try {
    const module = await getModule(slug);

    if (!module) {
      return null;
    }

    // Fetch time series data for each series in the module
    const seriesData = await Promise.all(
      module.series.map(async (seriesId: string) => {
        try {
          const series = await getTimeSeries(seriesId);
          return series;
        } catch (error) {
          console.error(`Error fetching series ${seriesId}:`, error);
          return null;
        }
      })
    );

    return { ...module, seriesData: seriesData.filter(Boolean) };
  } catch (error) {
    console.error('Error fetching module:', error);
    return null;
  }
}

export default async function ModulePage({
  params,
}: {
  params: { slug: string };
}) {
  const module = await getModuleWithData(params.slug);

  if (!module) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-gutter py-6">
          <Link href="/" className="text-sm text-accent hover:text-accent-dark mb-2 block">
            ? Back to Home
          </Link>
          <h1 className="text-2xl font-serif font-bold">{module.title}</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-gutter py-8 md:py-12">
        {/* Headline Block */}
        <HeadlineBlock
          headline={module.headline}
          subhead={module.subhead}
        />

        {/* KPI Tiles */}
        {module.kpis && module.kpis.length > 0 && (
          <section className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {module.kpis.map((kpi: any) => (
                <KPITile key={kpi.id} metric={kpi} />
              ))}
            </div>
          </section>
        )}

        {/* Charts */}
        {module.seriesData && module.seriesData.length > 0 && (
          <section className="mb-12">
            <h2 className="text-headline mb-6">Trends</h2>
            {module.seriesData.map((series: any) => (
              <div key={series.id} className="mb-8">
                <TimeSeriesChart
                  series={[series]}
                  title={series.name}
                  policyBand={module.policy_band}
                  height={450}
                  source={series.source}
                  lastUpdated={series.last_updated}
                />
              </div>
            ))}
          </section>
        )}

        {/* Methodology & Context */}
        {(module.methodology || module.confounders) && (
          <section className="border-t border-gray-200 pt-8 mt-12">
            <details className="mb-4">
              <summary className="cursor-pointer text-lg font-medium text-gray-700 mb-4">
                Methodology & Context
              </summary>
              <div className="prose prose-sm max-w-none mt-4">
                {module.methodology && (
                  <div className="mb-4">
                    <h3 className="text-base font-semibold mb-2">Methodology</h3>
                    <p className="text-gray-600">{module.methodology}</p>
                  </div>
                )}
                {module.confounders && module.confounders.length > 0 && (
                  <div>
                    <h3 className="text-base font-semibold mb-2">
                      Other Factors to Consider
                    </h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {module.confounders.map((confounder: string, i: number) => (
                        <li key={i}>{confounder}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </details>
          </section>
        )}

        {/* Policy Timeline snippet */}
        {module.policy_band && (
          <section className="border-t border-gray-200 pt-8 mt-12">
            <h3 className="text-lg font-semibold mb-4">Policy Context</h3>
            <div className="bg-blue-50 border-l-4 border-accent p-4">
              <p className="text-sm text-gray-700">
                <strong>{module.policy_band.label}</strong> ? Effective from{' '}
                {new Date(module.policy_band.start).toLocaleDateString()}
                {module.policy_band.end
                  ? ` to ${new Date(module.policy_band.end).toLocaleDateString()}`
                  : ' (ongoing)'}
              </p>
            </div>
          </section>
        )}
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

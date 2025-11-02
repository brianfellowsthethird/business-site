'use client';

import type { KPIMetric } from '@/lib/types';
import { format } from 'date-fns';

interface KPITileProps {
  metric: KPIMetric;
  showSparkline?: boolean;
}

export default function KPITile({ metric, showSparkline = true }: KPITileProps) {
  const formatValue = (value: number): string => {
    if (Math.abs(value) >= 1e9) {
      return `$${(value / 1e9).toFixed(1)}B`;
    }
    if (Math.abs(value) >= 1e6) {
      return `$${(value / 1e6).toFixed(1)}M`;
    }
    if (Math.abs(value) >= 1e3) {
      return `$${(value / 1e3).toFixed(1)}K`;
    }
    return value.toFixed(2);
  };

  const deltaClass =
    metric.trend === 'up'
      ? 'up'
      : metric.trend === 'down'
      ? 'down'
      : '';

  return (
    <div className="kpi-tile">
      <div className="mb-2">
        <div className="text-sm text-gray-600 font-medium">{metric.id}</div>
      </div>
      <div className="kpi-value mb-2">{formatValue(metric.value)}</div>
      {metric.delta !== undefined && (
        <div className={`kpi-delta ${deltaClass}`}>
          {metric.delta_percent !== undefined
            ? `${metric.delta_percent > 0 ? '+' : ''}${metric.delta_percent.toFixed(1)}%`
            : `${metric.delta > 0 ? '+' : ''}${formatValue(metric.delta)}`}
          {' '}
          {metric.period}
        </div>
      )}
      {showSparkline && metric.sparkline && metric.sparkline.length > 0 && (
        <div className="mt-4 h-12">
          <svg width="100%" height="48" className="overflow-visible">
            <polyline
              points={metric.sparkline
                .map((val, i) => {
                  const x = (i / (metric.sparkline!.length - 1)) * 100;
                  const min = Math.min(...metric.sparkline!);
                  const max = Math.max(...metric.sparkline!);
                  const range = max - min || 1;
                  const y = 48 - ((val - min) / range) * 40;
                  return `${x},${y}`;
                })
                .join(' ')}
              fill="none"
              stroke="#2563eb"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      )}
      <div className="source-badge mt-2">
        Updated {format(new Date(metric.last_updated), 'MMM d, yyyy')}
      </div>
    </div>
  );
}

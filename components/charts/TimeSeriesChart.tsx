'use client';

import ReactECharts from 'echarts-for-react';
import type { TimeSeries, PolicyEvent } from '@/lib/types';
import { format } from 'date-fns';

interface TimeSeriesChartProps {
  series: TimeSeries[];
  title?: string;
  policyBand?: {
    start: string;
    end?: string;
    label: string;
  };
  events?: PolicyEvent[];
  height?: number;
  source?: string;
  lastUpdated?: string;
}

export default function TimeSeriesChart({
  series,
  title,
  policyBand,
  events,
  height = 400,
  source,
  lastUpdated,
}: TimeSeriesChartProps) {
  const option = {
    title: title
      ? {
          text: title,
          left: 'center',
          textStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            fontFamily: 'Charter, serif',
          },
        }
      : undefined,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
      formatter: (params: any) => {
        if (Array.isArray(params)) {
          let tooltip = `<strong>${params[0].axisValue}</strong><br/>`;
          params.forEach((param: any) => {
            tooltip += `${param.marker} ${param.seriesName}: <strong>${formatValue(
              param.value,
              param.seriesName
            )}</strong><br/>`;
          });
          return tooltip;
        }
        return '';
      },
    },
    legend: {
      data: series.map((s) => s.name),
      bottom: 0,
      textStyle: {
        fontSize: 12,
      },
    },
    grid: {
      left: '10%',
      right: '10%',
      top: series.length > 1 ? '15%' : '10%',
      bottom: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: series[0]?.data.map((d) => d.date) || [],
      axisLabel: {
        fontSize: 11,
        fontFamily: 'Inter, sans-serif',
      },
      axisLine: {
        lineStyle: {
          color: '#9ca3af',
          width: 1,
        },
      },
    },
    yAxis: series.map((s, index) => ({
      type: 'value',
      name: s.units,
      position: index === 0 ? 'left' : 'right',
      nameTextStyle: {
        fontSize: 11,
        fontFamily: 'Inter, sans-serif',
      },
      axisLabel: {
        fontSize: 11,
        fontFamily: 'Inter, sans-serif',
        formatter: (value: number) => formatValue(value, s.name),
      },
      axisLine: {
        lineStyle: {
          color: '#9ca3af',
          width: 1,
        },
      },
      splitLine: {
        lineStyle: {
          color: '#f3f4f6',
          width: 1,
        },
      },
    })),
    series: series.map((s, index) => ({
      name: s.name,
      type: 'line',
      data: s.data.map((d) => d.value),
      smooth: true,
      lineStyle: {
        width: 2,
        color: getSeriesColor(index),
      },
      itemStyle: {
        color: getSeriesColor(index),
      },
      yAxisIndex: index,
      symbol: 'circle',
      symbolSize: 4,
      areaStyle: index === 0
        ? {
            opacity: 0.1,
            color: getSeriesColor(0),
          }
        : undefined,
    })),
    graphic: [
      ...(policyBand
        ? [
            {
              type: 'rect',
              left: '10%',
              right: '10%',
              top: series.length > 1 ? '15%' : '10%',
              bottom: '15%',
              z: 0,
              shape: {
                x: calculatePolicyBandX(policyBand.start, series[0]?.data || []),
                width: calculatePolicyBandWidth(
                  policyBand.start,
                  policyBand.end,
                  series[0]?.data || []
                ),
              },
              style: {
                fill: '#2563eb',
                opacity: 0.1,
              },
            },
          ]
        : []),
      ...(events || []).map((event) => ({
        type: 'circle',
        position: [
          calculateEventX(event.date, series[0]?.data || []),
          '50%',
        ],
        z: 10,
        shape: {
          r: 4,
        },
        style: {
          fill: '#dc2626',
        },
      })),
    ],
  };

  return (
    <div className="chart-container">
      <ReactECharts
        option={option}
        style={{ height: `${height}px`, width: '100%' }}
        opts={{ renderer: 'svg' }}
      />
      {source && (
        <div className="source-badge mt-4">
          Source: {source}
          {lastUpdated && ` ? Updated ${format(new Date(lastUpdated), 'MMM d, yyyy')}`}
        </div>
      )}
    </div>
  );
}

function formatValue(value: number, seriesName: string): string {
  if (seriesName.toLowerCase().includes('percent') || seriesName.toLowerCase().includes('%')) {
    return `${value.toFixed(1)}%`;
  }
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
}

function getSeriesColor(index: number): string {
  const colors = ['#2563eb', '#dc2626', '#059669', '#d97706', '#7c3aed'];
  return colors[index % colors.length];
}

function calculatePolicyBandX(startDate: string, data: any[]): number {
  if (data.length === 0) return 0;
  const startIndex = data.findIndex((d) => d.date >= startDate);
  if (startIndex === -1) return 0;
  return (startIndex / data.length) * 80 + 10; // Percentage of chart width
}

function calculatePolicyBandWidth(startDate: string, endDate: string | undefined, data: any[]): number {
  if (data.length === 0) return 0;
  const startIndex = data.findIndex((d) => d.date >= startDate);
  const endIndex = endDate
    ? data.findIndex((d) => d.date >= endDate)
    : data.length - 1;
  
  if (startIndex === -1 || endIndex === -1) return 0;
  return ((endIndex - startIndex) / data.length) * 80;
}

function calculateEventX(eventDate: string, data: any[]): number {
  if (data.length === 0) return 0;
  const eventIndex = data.findIndex((d) => d.date >= eventDate);
  if (eventIndex === -1) return 0;
  return (eventIndex / data.length) * 80 + 10;
}

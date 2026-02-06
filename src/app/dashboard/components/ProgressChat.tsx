'use client';

import React, { useMemo, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartOptions,
  ScriptableContext,
  ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const progressValues = [14, 32, 28, 30, 60, 48, 16];
const scheduledValues = [12, 30, 24, 26, 50, 42, 14];

const ProgressChart: React.FC = () => {
  const chartRef = useRef<ChartJS<'line'> | null>(null);

  const gradientFill = (
    ctx: ScriptableContext<'line'>,
    stops: Array<[number, string]>
  ) => {
    const { chartArea, ctx: canvasCtx } = ctx.chart;
    if (!chartArea) return 'rgba(0,0,0,0)';

    const gradient = canvasCtx.createLinearGradient(
      0,
      chartArea.top,
      0,
      chartArea.bottom
    );

    stops.forEach(([pos, color]) => gradient.addColorStop(pos, color));
    return gradient;
  };

  const data: ChartData<'line'> = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: 'Progress',
          data: progressValues,
          tension: 0.4,
          borderWidth: 2.5,
          borderColor: '#3b82f6',
          pointRadius: 0,
          fill: 'start',
          backgroundColor: (ctx) =>
            gradientFill(ctx, [
              [0, 'rgba(59,130,246,0.95)'],
              [0.5, 'rgba(96,165,250,0.6)'],
              [1, 'rgba(59,130,246,0.05)'],
            ]),
        },
        {
          label: 'Scheduled',
          data: scheduledValues,
          tension: 0.4,
          borderWidth: 2.5,
          borderColor: '#16a34a',
          pointRadius: 0,
          fill: 'start',
          backgroundColor: (ctx) =>
            gradientFill(ctx, [
              [0, 'rgba(34,197,94,0.9)'],
              [0.5, 'rgba(34,197,94,0.5)'],
              [1, 'rgba(34,197,94,0.06)'],
            ]),
        },
      ],
    }),
    []
  );

  const options: ChartOptions<'line'> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            boxWidth: 10,
            padding: 24,
            color: '#374151',
          },
        },
        tooltip: {
          backgroundColor: '#111827',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
        },
      },
      scales: {
        y: {
          min: 0,
          max: 60,
          ticks: {
            stepSize: 15,
            color: '#6b7280',
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        x: {
          ticks: {
            color: '#6b7280',
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
      },
    }),
    []
  );

  return (
    <div className="bg-white border rounded-xl p-6">
      {/* Header – same style as Alerts */}
      <div className="mb-4">
        <h2 className="text-sm font-medium text-gray-900">
          Progress vs schedule
        </h2>
      </div>

      {/* Chart */}
      <div className="h-[300px]">
        <Line ref={chartRef} data={data} options={options} />
      </div>
    </div>
  );
};

export default ProgressChart;
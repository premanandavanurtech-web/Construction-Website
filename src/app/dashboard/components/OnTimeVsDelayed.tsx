'use client';

import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const labels = ['Site A', 'Site B', 'Site C', 'Site D'];

const OnTimeVsDelayed = () => {
  const data: ChartData<'bar'> = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: 'On time',
          data: [40, 28, 17, 14],
          backgroundColor: '#0000FF',
          borderRadius: 4,
          barThickness: 28,
        },
        {
          label: 'Delayed',
          data: [10, 4, 10, 6],
          backgroundColor: '#22C55E',
          borderRadius: 4,
          barThickness: 28,
        },
      ],
    }),
    []
  );

  const options: ChartOptions<'bar'> = useMemo(
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
          max: 40,
          ticks: {
            stepSize: 10,
            color: '#6b7280',
          },
          grid: {
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
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-sm font-medium text-gray-900">
          On Time vs Delayed Delivery
        </h2>
      </div>

      {/* Chart */}
      <div className="h-[300px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default OnTimeVsDelayed;
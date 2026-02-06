'use client';

import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const data: ChartData<'pie'> = {
  labels: [
    'Material - 69%',
    'Equipment - 15%',
    'Labour - 11%',
    'Misc - 4%',
  ],
  datasets: [
    {
      data: [69, 15, 11, 4],
      backgroundColor: [
        '#0000FF', // Material - blue
        '#EF4444', // Equipment - red
        '#22C55E', // Labour - green
        '#FACC15', // Misc - yellow
      ],
      borderWidth: 0,
    },
  ],
};

const options: ChartOptions<'pie'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      labels: {
        boxWidth: 12,
        padding: 16,
        color: '#374151',
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      backgroundColor: '#111827',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
    },
  },
};

const BudgetDistribution = () => {
  return (
    <div className="bg-white border rounded-xl p-6">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-sm font-medium text-gray-900">
          Budget Distribution
        </h2>
      </div>

      {/* Chart */}
      <div className="h-[300px] flex items-center justify-center">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default BudgetDistribution;
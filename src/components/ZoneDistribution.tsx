import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { HeartRateZone } from '../types/health';
import { getZoneColor } from '../utils/heartRateUtils';

interface ZoneDistributionProps {
  zones: HeartRateZone[];
  height?: number;
}

const ZoneDistribution: React.FC<ZoneDistributionProps> = ({ zones, height = 300 }) => {
  const chartData = zones.map((zone) => ({
    name: zone.name,
    value: zone.count,
    percentage: zone.percentage,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={(entry: any) => `${entry.name}: ${entry.percentage.toFixed(1)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getZoneColor(entry.name)} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number | undefined, name: string | undefined, props: any) =>
          (value !== undefined && name !== undefined) ? [
            `${value} 次 (${props.payload.percentage.toFixed(1)}%)`,
            name
          ] : ['', '']
        } />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ZoneDistribution;

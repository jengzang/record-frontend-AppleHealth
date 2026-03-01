import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { HealthStatistics } from '../types/health';

interface HeartRateChartProps {
  data: HealthStatistics[];
  showMin?: boolean;
  showMax?: boolean;
  showAvg?: boolean;
  height?: number;
}

const HeartRateChart: React.FC<HeartRateChartProps> = ({
  data,
  showMin = true,
  showMax = true,
  showAvg = true,
  height = 300,
}) => {
  const chartData = data.map((stat) => ({
    date: stat.statDate,
    min: stat.minValue,
    avg: stat.avgValue,
    max: stat.maxValue,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => {
            const date = new Date(value);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          }}
        />
        <YAxis label={{ value: 'BPM', angle: -90, position: 'insideLeft' }} />
        <Tooltip
          labelFormatter={(value) => {
            const date = new Date(value as string);
            return date.toLocaleDateString('zh-CN');
          }}
          formatter={(value: number | undefined) => (value !== undefined ? [`${Math.round(value)} BPM`] : [''])}
        />
        <Legend />
        {showMin && <Line type="monotone" dataKey="min" stroke="#52c41a" name="最小心率" dot={false} />}
        {showAvg && <Line type="monotone" dataKey="avg" stroke="#1890ff" name="平均心率" strokeWidth={2} />}
        {showMax && <Line type="monotone" dataKey="max" stroke="#f5222d" name="最大心率" dot={false} />}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default HeartRateChart;

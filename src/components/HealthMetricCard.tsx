import React from 'react';
import { Card, Statistic } from 'antd';
import type { ReactNode } from 'react';

interface HealthMetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  color?: string;
  loading?: boolean;
}

const HealthMetricCard: React.FC<HealthMetricCardProps> = ({
  title,
  value,
  unit,
  icon,
  trend,
  color = '#1890ff',
  loading = false,
}) => {
  return (
    <Card loading={loading} style={{ height: '100%' }}>
      <Statistic
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {icon && <span style={{ color }}>{icon}</span>}
            <span>{title}</span>
          </div>
        }
        value={value}
        suffix={unit}
        valueStyle={{ color }}
      />
      {trend && (
        <div style={{ marginTop: '8px', fontSize: '14px', color: '#8c8c8c' }}>
          <span style={{ color: trend.direction === 'up' ? '#52c41a' : '#f5222d' }}>
            {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span style={{ marginLeft: '4px' }}>vs last period</span>
        </div>
      )}
    </Card>
  );
};

export default HealthMetricCard;

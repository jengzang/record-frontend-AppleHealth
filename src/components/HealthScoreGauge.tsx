import React from 'react';
import { Progress } from 'antd';
import { getGradeColor } from '../utils/heartRateUtils';

interface HealthScoreGaugeProps {
  score: number;
  grade: string;
  size?: number;
}

const HealthScoreGauge: React.FC<HealthScoreGaugeProps> = ({ score, grade, size = 200 }) => {
  const color = getGradeColor(grade);

  return (
    <div style={{ textAlign: 'center' }}>
      <Progress
        type="circle"
        percent={score}
        format={() => (
          <div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color }}>{Math.round(score)}</div>
            <div style={{ fontSize: '24px', color }}>{grade}</div>
          </div>
        )}
        strokeColor={color}
        width={size}
      />
      <div style={{ marginTop: '16px', fontSize: '16px', color: '#8c8c8c' }}>
        健康评分
      </div>
    </div>
  );
};

export default HealthScoreGauge;

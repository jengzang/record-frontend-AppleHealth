import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Alert, Spin, Tag, Timeline } from 'antd';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { healthApiService } from '../services/healthApiService';
import type { WeightBMIAnalysis } from '../types/health';

const WeightBMI: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<WeightBMIAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await healthApiService.getWeightBMIAnalysis();
      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const getBMICategoryColor = (category: string): string => {
    switch (category) {
      case 'normal':
        return 'green';
      case 'underweight':
        return 'blue';
      case 'overweight':
        return 'orange';
      case 'obese':
        return 'red';
      default:
        return 'default';
    }
  };

  const getTrendColor = (trend: string): string => {
    if (trend.includes('increasing')) return '#ff4d4f';
    if (trend.includes('decreasing')) return '#52c41a';
    return '#1890ff';
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  if (!analysis) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert message="No Data" description="No weight data available" type="info" showIcon />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ marginBottom: '24px' }}>体重与BMI管理</h2>

      {/* Current Status */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="当前体重"
              value={analysis.currentWeight}
              suffix="kg"
              precision={1}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="当前BMI"
              value={analysis.currentBMI}
              precision={1}
            />
            <Tag color={getBMICategoryColor(analysis.bmiCategory)} style={{ marginTop: '8px' }}>
              {analysis.bmiCategory}
            </Tag>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="体重变化"
              value={analysis.statistics.weightChange}
              suffix="kg"
              precision={1}
              valueStyle={{ color: analysis.statistics.weightChange > 0 ? '#ff4d4f' : '#52c41a' }}
            />
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#8c8c8c' }}>
              {analysis.statistics.changePercentage > 0 ? '+' : ''}
              {analysis.statistics.changePercentage.toFixed(1)}%
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="数据点数"
              value={analysis.statistics.dataPoints}
            />
          </Card>
        </Col>
      </Row>

      {/* Health Status */}
      <Card title="健康状态" style={{ marginBottom: '24px' }}>
        <Alert
          message={analysis.healthStatus}
          type={analysis.bmiCategory === 'normal' ? 'success' : 'warning'}
          showIcon
        />
      </Card>

      {/* Weight Trend Chart */}
      <Card title="体重趋势" style={{ marginBottom: '24px' }}>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={analysis.weightTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" label={{ value: '体重 (kg)', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: 'BMI', angle: 90, position: 'insideRight' }} />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="weight"
              stroke="#1890ff"
              name="体重"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="bmi"
              stroke="#52c41a"
              name="BMI"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <ReferenceLine yAxisId="right" y={18.5} stroke="#ff4d4f" strokeDasharray="3 3" label="偏瘦" />
            <ReferenceLine yAxisId="right" y={24} stroke="#52c41a" strokeDasharray="3 3" label="正常" />
            <ReferenceLine yAxisId="right" y={28} stroke="#faad14" strokeDasharray="3 3" label="超重" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Prediction */}
      <Card title="30天预测" style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Statistic
              title="预测体重"
              value={analysis.prediction.predictedWeight}
              suffix="kg"
              precision={1}
            />
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#8c8c8c' }}>
              预测日期: {analysis.prediction.targetDate}
            </div>
          </Col>
          <Col xs={24} md={12}>
            <Statistic
              title="预测BMI"
              value={analysis.prediction.predictedBMI}
              precision={1}
            />
            <Tag color={getTrendColor(analysis.prediction.trend)} style={{ marginTop: '8px' }}>
              {analysis.prediction.trend}
            </Tag>
          </Col>
        </Row>
      </Card>

      {/* Recommendations */}
      <Card title="健康建议">
        <Timeline>
          {analysis.recommendations.map((rec, index) => (
            <Timeline.Item key={index}>{rec}</Timeline.Item>
          ))}
        </Timeline>
      </Card>
    </div>
  );
};

export default WeightBMI;

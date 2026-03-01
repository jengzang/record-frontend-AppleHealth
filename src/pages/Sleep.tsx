import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Alert, Spin, Progress, Tag } from 'antd';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import {
  ClockCircleOutlined,
  TrophyOutlined,
  HeartOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { healthApiService } from '../services/healthApiService';
import type { SleepAnalysis } from '../types/health';

const STAGE_COLORS = {
  deepSleep: '#1890ff',
  lightSleep: '#52c41a',
  remSleep: '#faad14',
  awake: '#ff4d4f',
};

const Sleep: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<SleepAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await healthApiService.getSleepAnalysis();
      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade: string): string => {
    if (grade.startsWith('A')) return '#52c41a';
    if (grade === 'B') return '#1890ff';
    if (grade === 'C') return '#faad14';
    return '#ff4d4f';
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
        <Alert message="No Data" description="No sleep data available" type="info" showIcon />
      </div>
    );
  }

  const { summary, dailySleep, sleepStages, sleepPattern, qualityScore, heartRateCorrelation, recommendations } = analysis;

  // Prepare sleep stage data for pie chart
  const stageData = [
    { name: '深睡', value: sleepStages.deepSleepPercent, color: STAGE_COLORS.deepSleep },
    { name: '浅睡', value: sleepStages.lightSleepPercent, color: STAGE_COLORS.lightSleep },
    { name: 'REM', value: sleepStages.remSleepPercent, color: STAGE_COLORS.remSleep },
    { name: '清醒', value: sleepStages.awakePercent, color: STAGE_COLORS.awake },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ marginBottom: '24px' }}>睡眠质量分析</h2>

      {/* Quality Score Card */}
      <Card style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <div style={{ textAlign: 'center', color: 'white' }}>
              <div style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '8px' }}>
                {qualityScore.overallScore.toFixed(0)}
              </div>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                <Tag color={getGradeColor(qualityScore.grade)} style={{ fontSize: '20px', padding: '4px 16px' }}>
                  {qualityScore.grade}
                </Tag>
              </div>
              <div style={{ fontSize: '16px', opacity: 0.9 }}>睡眠质量评分</div>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div style={{ color: 'white' }}>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ marginBottom: '4px' }}>时长评分: {qualityScore.durationScore.toFixed(0)}</div>
                <Progress percent={qualityScore.durationScore} strokeColor="#52c41a" showInfo={false} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ marginBottom: '4px' }}>效率评分: {qualityScore.efficiencyScore.toFixed(0)}</div>
                <Progress percent={qualityScore.efficiencyScore} strokeColor="#1890ff" showInfo={false} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ marginBottom: '4px' }}>规律评分: {qualityScore.consistencyScore.toFixed(0)}</div>
                <Progress percent={qualityScore.consistencyScore} strokeColor="#faad14" showInfo={false} />
              </div>
              <div>
                <div style={{ marginBottom: '4px' }}>深睡评分: {qualityScore.deepSleepScore.toFixed(0)}</div>
                <Progress percent={qualityScore.deepSleepScore} strokeColor="#722ed1" showInfo={false} />
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Summary Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="平均睡眠时长"
              value={summary.avgSleepDuration}
              suffix="小时"
              precision={1}
              prefix={<ClockCircleOutlined />}
            />
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#8c8c8c' }}>
              记录天数: {summary.totalSleepDays} 天
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="平均深睡时长"
              value={summary.avgDeepSleep}
              suffix="小时"
              precision={1}
              valueStyle={{ color: STAGE_COLORS.deepSleep }}
            />
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#8c8c8c' }}>
              {sleepStages.deepSleepPercent.toFixed(1)}% 深睡比例
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="平均入睡时间"
              value={summary.avgBedTime}
              prefix={<ClockCircleOutlined />}
            />
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#8c8c8c' }}>
              规律性: {sleepPattern.bedTimeConsistency.toFixed(0)}%
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="睡眠效率"
              value={summary.sleepEfficiency}
              suffix="%"
              precision={1}
              prefix={<TrophyOutlined />}
            />
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#8c8c8c' }}>
              优秀: ≥85%
            </div>
          </Card>
        </Col>
      </Row>

      {/* Daily Sleep Trend */}
      <Card title="每日睡眠时长趋势" style={{ marginBottom: '24px' }}>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={dailySleep.slice().reverse()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis label={{ value: '小时', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="totalSleep"
              stackId="1"
              stroke={STAGE_COLORS.deepSleep}
              fill={STAGE_COLORS.deepSleep}
              fillOpacity={0.6}
              name="总睡眠"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Sleep Stages and Pattern */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <Card title="睡眠阶段分布">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stageData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.name} ${entry.value.toFixed(1)}%`}
                >
                  {stageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="睡眠模式分析">
            <div style={{ padding: '16px' }}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '4px' }}>工作日平均</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                      {sleepPattern.weekdayAvgSleep.toFixed(1)}h
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '4px' }}>周末平均</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                      {sleepPattern.weekendAvgSleep.toFixed(1)}h
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '4px' }}>睡眠债务</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: sleepPattern.sleepDebt > 1 ? '#ff4d4f' : '#52c41a' }}>
                      {sleepPattern.sleepDebt.toFixed(1)}h
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '4px' }}>最佳入睡时间</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#722ed1' }}>
                      {sleepPattern.optimalBedTime}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Heart Rate Correlation */}
      <Card title="心率与睡眠关联" style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Statistic
              title="睡眠期间平均心率"
              value={heartRateCorrelation.avgSleepingHR}
              suffix="bpm"
              precision={0}
              prefix={<HeartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col xs={24} md={8}>
            <Statistic
              title="清醒期间平均心率"
              value={heartRateCorrelation.avgWakingHR}
              suffix="bpm"
              precision={0}
              prefix={<HeartOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Col>
          <Col xs={24} md={8}>
            <Statistic
              title="心率下降"
              value={heartRateCorrelation.hrDrop}
              suffix="bpm"
              precision={0}
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#8c8c8c' }}>
              下降 {heartRateCorrelation.hrDropPercent.toFixed(1)}%
            </div>
          </Col>
          <Col span={24}>
            <Alert message={heartRateCorrelation.insight} type="info" showIcon />
          </Col>
        </Row>
      </Card>

      {/* Recommendations */}
      <Card title="睡眠建议">
        {recommendations.map((rec, index) => (
          <Alert
            key={index}
            message={rec}
            type="info"
            showIcon
            style={{ marginBottom: index < recommendations.length - 1 ? '8px' : 0 }}
          />
        ))}
      </Card>
    </div>
  );
};

export default Sleep;

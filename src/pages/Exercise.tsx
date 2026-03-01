import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Alert, Spin, Progress, Tag, Badge } from 'antd';
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
  Area,
  AreaChart,
} from 'recharts';
import {
  TrophyOutlined,
  FireOutlined,
  ThunderboltOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import { healthApiService } from '../services/healthApiService';
import type { ExerciseAnalysis } from '../types/health';

const COLORS = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2'];

const Exercise: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<ExerciseAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await healthApiService.getExerciseAnalysis();
      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const getIntensityColor = (score: number): string => {
    if (score >= 80) return '#52c41a';
    if (score >= 50) return '#faad14';
    return '#ff4d4f';
  };

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'steps':
        return <RiseOutlined style={{ fontSize: '24px', color: '#1890ff' }} />;
      case 'distance':
        return <ThunderboltOutlined style={{ fontSize: '24px', color: '#52c41a' }} />;
      case 'calories':
        return <FireOutlined style={{ fontSize: '24px', color: '#faad14' }} />;
      case 'workout':
        return <TrophyOutlined style={{ fontSize: '24px', color: '#722ed1' }} />;
      default:
        return <TrophyOutlined style={{ fontSize: '24px' }} />;
    }
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
        <Alert message="No Data" description="No exercise data available" type="info" showIcon />
      </div>
    );
  }

  const { summary, dailyStats, workoutTypes, calorieTrend, intensityAnalysis, achievements, recommendations } = analysis;

  // Prepare intensity data for pie chart
  const intensityData = [
    { name: '低强度', value: intensityAnalysis.lowIntensity.minutes, color: '#91d5ff' },
    { name: '中强度', value: intensityAnalysis.moderateIntensity.minutes, color: '#52c41a' },
    { name: '高强度', value: intensityAnalysis.highIntensity.minutes, color: '#ff4d4f' },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ marginBottom: '24px' }}>运动数据分析</h2>

      {/* Summary Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总步数"
              value={summary.totalSteps}
              suffix="步"
              prefix={<RiseOutlined />}
            />
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#8c8c8c' }}>
              日均 {summary.avgDailySteps.toFixed(0)} 步
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总距离"
              value={summary.totalDistance}
              suffix="km"
              precision={1}
              prefix={<ThunderboltOutlined />}
            />
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#8c8c8c' }}>
              日均 {summary.avgDailyDistance.toFixed(1)} km
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总消耗"
              value={summary.totalCalories}
              suffix="kcal"
              precision={0}
              prefix={<FireOutlined />}
            />
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#8c8c8c' }}>
              日均 {summary.avgDailyCalories.toFixed(0)} kcal
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="运动次数"
              value={summary.totalWorkouts}
              suffix="次"
              prefix={<TrophyOutlined />}
            />
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#8c8c8c' }}>
              活跃天数 {summary.activeDays} 天
            </div>
          </Card>
        </Col>
      </Row>

      {/* Daily Steps Trend */}
      <Card title="每日步数趋势" style={{ marginBottom: '24px' }}>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={dailyStats.slice().reverse()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="steps"
              stroke="#1890ff"
              fill="#1890ff"
              fillOpacity={0.3}
              name="步数"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Workout Types Distribution */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <Card title="运动类型分布">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={workoutTypes}
                  dataKey="count"
                  nameKey="workoutType"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.workoutType} (${entry.percentage.toFixed(1)}%)`}
                >
                  {workoutTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="运动强度分析">
            <div style={{ marginBottom: '16px' }}>
              <div style={{ marginBottom: '8px' }}>
                <span>强度评分: </span>
                <Tag color={getIntensityColor(intensityAnalysis.intensityScore)}>
                  {intensityAnalysis.intensityScore.toFixed(0)}/100
                </Tag>
              </div>
              <Progress
                percent={intensityAnalysis.intensityScore}
                strokeColor={getIntensityColor(intensityAnalysis.intensityScore)}
                status="active"
              />
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={intensityData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {intensityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Calorie Trend */}
      <Card title="卡路里消耗趋势" style={{ marginBottom: '24px' }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={calorieTrend.slice().reverse()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="activeCalories" stackId="a" fill="#ff4d4f" name="活动消耗" />
            <Bar dataKey="restingCalories" stackId="a" fill="#91d5ff" name="静息消耗" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Achievements */}
      {achievements.length > 0 && (
        <Card title="运动成就" style={{ marginBottom: '24px' }}>
          <Row gutter={[16, 16]}>
            {achievements.map((achievement, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <Card>
                  <div style={{ textAlign: 'center' }}>
                    {getAchievementIcon(achievement.type)}
                    <h4 style={{ marginTop: '8px' }}>{achievement.title}</h4>
                    <p style={{ fontSize: '12px', color: '#8c8c8c' }}>{achievement.description}</p>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>
                      {achievement.value.toFixed(0)} {achievement.unit}
                    </div>
                    {achievement.date && (
                      <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px' }}>
                        {achievement.date}
                      </div>
                    )}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}

      {/* Recommendations */}
      <Card title="运动建议">
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

export default Exercise;
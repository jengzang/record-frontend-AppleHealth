import React, { useEffect, useState } from 'react';
import { Card, Spin, Alert, Row, Col, Statistic, Tabs, Table, Tag } from 'antd';
import { TrophyOutlined, RiseOutlined, FallOutlined, LineChartOutlined } from '@ant-design/icons';
import {
  BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { healthApi } from '../services/healthApiService';

interface SeasonalStat {
  season: string;
  season_name: string;
  avg_heart_rate: number;
  avg_resting_hr: number;
  avg_steps: number;
  avg_distance: number;
  avg_calories: number;
  active_days: number;
  total_records: number;
}

interface MonthlyStat {
  month: number;
  month_name: string;
  year: number;
  avg_heart_rate: number;
  avg_steps: number;
  active_days: number;
}

interface YearlyComparison {
  year: number;
  avg_heart_rate: number;
  avg_steps: number;
  total_records: number;
  active_days: number;
}

interface SeasonalPatterns {
  most_active_season: string;
  least_active_season: string;
  highest_hr_season: string;
  lowest_hr_season: string;
  seasonal_variation: number;
  consistency_score: number;
}

interface AnnualReport {
  total_years: number;
  total_records: number;
  avg_heart_rate: number;
  avg_steps: number;
  total_distance: number;
  total_calories: number;
  health_trend: string;
  best_month: string;
  worst_month: string;
}

interface SeasonalTrends {
  seasonal_stats: SeasonalStat[];
  monthly_stats: MonthlyStat[];
  yearly_comparison: YearlyComparison[];
  seasonal_patterns: SeasonalPatterns;
  annual_report: AnnualReport;
  insights: string[];
}

const SeasonalTrends: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SeasonalTrends | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await healthApi.getSeasonalTrends();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !data) {
    return <Alert message="错误" description={error || '无数据'} type="error" showIcon />;
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <RiseOutlined style={{ color: '#52c41a' }} />;
      case 'declining': return <FallOutlined style={{ color: '#ff4d4f' }} />;
      default: return <LineChartOutlined style={{ color: '#1890ff' }} />;
    }
  };

  const getTrendText = (trend: string) => {
    switch (trend) {
      case 'improving': return '上升';
      case 'declining': return '下降';
      default: return '稳定';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'success';
      case 'declining': return 'error';
      default: return 'processing';
    }
  };

  const seasonalColumns = [
    {
      title: '季节',
      dataIndex: 'season_name',
      key: 'season_name',
    },
    {
      title: '平均心率',
      dataIndex: 'avg_heart_rate',
      key: 'avg_heart_rate',
      render: (val: number) => val.toFixed(1) + ' bpm',
    },
    {
      title: '平均步数',
      dataIndex: 'avg_steps',
      key: 'avg_steps',
      render: (val: number) => val.toFixed(0),
    },
    {
      title: '平均距离',
      dataIndex: 'avg_distance',
      key: 'avg_distance',
      render: (val: number) => val.toFixed(2) + ' km',
    },
    {
      title: '活跃天数',
      dataIndex: 'active_days',
      key: 'active_days',
    },
  ];

  const yearlyColumns = [
    {
      title: '年份',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: '平均心率',
      dataIndex: 'avg_heart_rate',
      key: 'avg_heart_rate',
      render: (val: number) => val.toFixed(1) + ' bpm',
    },
    {
      title: '平均步数',
      dataIndex: 'avg_steps',
      key: 'avg_steps',
      render: (val: number) => val.toFixed(0),
    },
    {
      title: '活跃天数',
      dataIndex: 'active_days',
      key: 'active_days',
    },
    {
      title: '总记录数',
      dataIndex: 'total_records',
      key: 'total_records',
    },
  ];

  // 季节雷达图数据
  const radarData = data.seasonal_stats.map(stat => ({
    season: stat.season_name,
    steps: stat.avg_steps / 100, // 缩放以适应雷达图
    heartRate: stat.avg_heart_rate,
    distance: stat.avg_distance * 10,
    calories: stat.avg_calories / 10,
  }));

  // 月度趋势数据
  const monthlyTrendData = data.monthly_stats.slice().reverse().map(stat => ({
    month: `${stat.year}-${stat.month_name}`,
    steps: stat.avg_steps,
    heartRate: stat.avg_heart_rate,
  }));

  return (
    <div style={{ padding: '24px' }}>
      <h1>季节性健康趋势分析</h1>

      {/* 年度报告 */}
      <Card title="年度健康报告" style={{ marginBottom: '24px' }}>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="数据年限"
              value={data.annual_report.total_years}
              suffix="年"
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="平均心率"
              value={data.annual_report.avg_heart_rate.toFixed(1)}
              suffix="bpm"
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="平均步数"
              value={data.annual_report.avg_steps.toFixed(0)}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="总距离"
              value={data.annual_report.total_distance.toFixed(0)}
              suffix="km"
            />
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: '16px' }}>
          <Col span={8}>
            <Card size="small">
              <Statistic
                title="健康趋势"
                value={getTrendText(data.annual_report.health_trend)}
                prefix={getTrendIcon(data.annual_report.health_trend)}
                valueStyle={{ fontSize: '20px' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small">
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#52c41a', fontSize: '14px' }}>最佳月份</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '8px' }}>
                  {data.annual_report.best_month}
                </div>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small">
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#ff4d4f', fontSize: '14px' }}>最差月份</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '8px' }}>
                  {data.annual_report.worst_month}
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* 季节模式 */}
      <Card title="季节模式识别" style={{ marginBottom: '24px' }}>
        <Row gutter={16}>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#1890ff', fontSize: '14px' }}>最活跃季节</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '8px' }}>
                {data.seasonal_patterns.most_active_season}
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#faad14', fontSize: '14px' }}>最不活跃季节</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '8px' }}>
                {data.seasonal_patterns.least_active_season}
              </div>
            </div>
          </Col>
          <Col span={6}>
            <Statistic
              title="季节变异系数"
              value={data.seasonal_patterns.seasonal_variation.toFixed(1)}
              suffix="%"
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="一致性评分"
              value={data.seasonal_patterns.consistency_score.toFixed(1)}
              suffix="/100"
              valueStyle={{
                color: data.seasonal_patterns.consistency_score >= 80 ? '#52c41a' :
                       data.seasonal_patterns.consistency_score >= 50 ? '#faad14' : '#ff4d4f'
              }}
            />
          </Col>
        </Row>
      </Card>

      {/* 洞察 */}
      <Card title="健康洞察" icon={<TrophyOutlined />} style={{ marginBottom: '24px' }}>
        <ul>
          {data.insights.map((insight, idx) => (
            <li key={idx} style={{ marginBottom: '8px' }}>{insight}</li>
          ))}
        </ul>
      </Card>

      {/* Tabs */}
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="季节统计" key="1">
          <Card>
            <Table
              columns={seasonalColumns}
              dataSource={data.seasonal_stats}
              rowKey="season"
              pagination={false}
            />
          </Card>
        </Tabs.TabPane>

        <Tabs.TabPane tab="季节雷达图" key="2">
          <Card>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="season" />
                <PolarRadiusAxis />
                <Radar name="步数(x100)" dataKey="steps" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Radar name="心率" dataKey="heartRate" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                <Radar name="距离(x10)" dataKey="distance" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </Tabs.TabPane>

        <Tabs.TabPane tab="月度趋势" key="3">
          <Card>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} />
                <YAxis yAxisId="left" label={{ value: '步数', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: '心率(bpm)', angle: 90, position: 'insideRight' }} />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="steps" stroke="#8884d8" name="平均步数" />
                <Line yAxisId="right" type="monotone" dataKey="heartRate" stroke="#82ca9d" name="平均心率" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Tabs.TabPane>

        <Tabs.TabPane tab="年度对比" key="4">
          <Card>
            <Table
              columns={yearlyColumns}
              dataSource={data.yearly_comparison}
              rowKey="year"
              pagination={false}
            />
          </Card>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default SeasonalTrends;

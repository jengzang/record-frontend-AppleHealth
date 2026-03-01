import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Spin, message } from 'antd';
import { HeartOutlined, LineChartOutlined, BarChartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import HealthMetricCard from '../components/HealthMetricCard';
import HeartRateChart from '../components/HeartRateChart';
import { healthApiService } from '../services/healthApiService';
import type { HealthSummary, HealthStatistics } from '../types/health';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<HealthSummary | null>(null);
  const [recentStats, setRecentStats] = useState<HealthStatistics[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [summaryData, statsData] = await Promise.all([
        healthApiService.getSummary(),
        healthApiService.getDailyStatistics('HeartRate', undefined, undefined, 30),
      ]);
      setSummary(summaryData);
      setRecentStats(statsData.statistics);
    } catch (error) {
      message.error('加载数据失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  const avgHeartRate = recentStats.length > 0
    ? (recentStats.reduce((sum, stat) => sum + stat.avgValue, 0) / recentStats.length).toFixed(1)
    : '0';

  const activeDays = recentStats.length;

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px' }}>Apple Health 数据分析</h1>

      {/* Metric Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <HealthMetricCard
            title="总记录数"
            value={summary?.totalRecords.toLocaleString() || '0'}
            icon={<HeartOutlined />}
            color="#f5222d"
          />
        </Col>
        <Col xs={24} sm={8}>
          <HealthMetricCard
            title="平均心率"
            value={avgHeartRate}
            unit="BPM"
            icon={<LineChartOutlined />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={8}>
          <HealthMetricCard
            title="活跃天数"
            value={activeDays}
            unit="天"
            icon={<BarChartOutlined />}
            color="#52c41a"
          />
        </Col>
      </Row>

      {/* Recent Trend Chart */}
      <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', marginBottom: '24px' }}>
        <h2 style={{ marginBottom: '16px' }}>最近30天心率趋势</h2>
        <HeartRateChart data={recentStats} height={300} />
      </div>

      {/* Quick Actions */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Button
            type="primary"
            size="large"
            block
            icon={<HeartOutlined />}
            onClick={() => navigate('/heartrate')}
          >
            查看心率分析
          </Button>
        </Col>
        <Col xs={24} sm={8}>
          <Button
            size="large"
            block
            icon={<LineChartOutlined />}
            onClick={() => navigate('/trends')}
          >
            查看趋势
          </Button>
        </Col>
        <Col xs={24} sm={8}>
          <Button
            size="large"
            block
            icon={<BarChartOutlined />}
            onClick={() => navigate('/analysis')}
          >
            健康分析
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default Home;

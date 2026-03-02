import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Alert, Spin, Table, Tag, Progress, Tabs } from 'antd';
import {
  TrophyOutlined,
  CrownOutlined,
  FireOutlined,
  HeartOutlined,
  ThunderboltOutlined,
  RiseOutlined,
  FallOutlined,
  MinusOutlined,
} from '@ant-design/icons';
import { healthApiService } from '../services/healthApiService';
import type { HealthRankings } from '../types/health';

const { TabPane } = Tabs;

const Rankings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [rankings, setRankings] = useState<HealthRankings | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await healthApiService.getHealthRankings();
      setRankings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
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

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  if (!rankings) {
    return <Alert message="No data available" type="info" showIcon />;
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <RiseOutlined style={{ color: '#52c41a' }} />;
      case 'declining':
        return <FallOutlined style={{ color: '#f5222d' }} />;
      default:
        return <MinusOutlined style={{ color: '#faad14' }} />;
    }
  };

  const getTrendText = (trend: string) => {
    switch (trend) {
      case 'improving':
        return '进步中';
      case 'declining':
        return '下降中';
      default:
        return '稳定';
    }
  };

  const columns = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      width: 80,
      render: (rank: number) => {
        if (rank === 1) return <CrownOutlined style={{ fontSize: 24, color: '#faad14' }} />;
        if (rank === 2) return <TrophyOutlined style={{ fontSize: 24, color: '#d9d9d9' }} />;
        if (rank === 3) return <TrophyOutlined style={{ fontSize: 24, color: '#cd7f32' }} />;
        return <span style={{ fontSize: 16, fontWeight: 'bold' }}>{rank}</span>;
      },
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      render: (date: string, record: any) => (
        <>
          {date}
          {record.isCurrent && <Tag color="blue" style={{ marginLeft: 8 }}>本月</Tag>}
        </>
      ),
    },
    {
      title: '数值',
      dataIndex: 'description',
      key: 'description',
      render: (desc: string) => <span style={{ fontSize: 16, fontWeight: 500 }}>{desc}</span>,
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: 24 }}>健康数据排行榜</h1>

      {/* Summary Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总追踪天数"
              value={rankings.summary.totalDaysTracked}
              suffix="天"
              prefix={<FireOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="当前连续天数"
              value={rankings.summary.currentStreak}
              suffix="天"
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="最长连续天数"
              value={rankings.summary.longestStreak}
              suffix="天"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="改进趋势"
              value={getTrendText(rankings.summary.improvement)}
              prefix={getTrendIcon(rankings.summary.improvement)}
            />
          </Card>
        </Col>
      </Row>

      {/* Personal Bests */}
      <Card title={<><CrownOutlined /> 个人最佳记录</>} style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={8}>
            <Card type="inner" title="最高步数">
              <Statistic
                value={rankings.personalBests.maxSteps.value}
                suffix={rankings.personalBests.maxSteps.unit}
                precision={0}
              />
              <div style={{ marginTop: 8, color: '#8c8c8c' }}>
                {rankings.personalBests.maxSteps.date}
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card type="inner" title="最远距离">
              <Statistic
                value={rankings.personalBests.maxDistance.value}
                suffix={rankings.personalBests.maxDistance.unit}
                precision={2}
              />
              <div style={{ marginTop: 8, color: '#8c8c8c' }}>
                {rankings.personalBests.maxDistance.date}
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card type="inner" title="最高卡路里">
              <Statistic
                value={rankings.personalBests.maxCalories.value}
                suffix={rankings.personalBests.maxCalories.unit}
                precision={0}
              />
              <div style={{ marginTop: 8, color: '#8c8c8c' }}>
                {rankings.personalBests.maxCalories.date}
              </div>
            </Card>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col span={8}>
            <Card type="inner" title="最低静息心率">
              <Statistic
                value={rankings.personalBests.lowestRestingHR.value}
                suffix={rankings.personalBests.lowestRestingHR.unit}
                precision={0}
                prefix={<HeartOutlined />}
              />
              <div style={{ marginTop: 8, color: '#8c8c8c' }}>
                {rankings.personalBests.lowestRestingHR.date}
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card type="inner" title="最长睡眠">
              <Statistic
                value={rankings.personalBests.longestSleep.value}
                suffix={rankings.personalBests.longestSleep.unit}
                precision={1}
              />
              <div style={{ marginTop: 8, color: '#8c8c8c' }}>
                {rankings.personalBests.longestSleep.date}
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card type="inner" title="最长运动">
              <Statistic
                value={rankings.personalBests.longestWorkout.value}
                suffix={rankings.personalBests.longestWorkout.unit}
                precision={0}
              />
              <div style={{ marginTop: 8, color: '#8c8c8c' }}>
                {rankings.personalBests.longestWorkout.date}
              </div>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Rankings Tables */}
      <Card>
        <Tabs defaultActiveKey="steps">
          <TabPane tab={<><ThunderboltOutlined /> 步数排行</>} key="steps">
            <Table
              columns={columns}
              dataSource={rankings.stepsRankings}
              pagination={false}
              rowKey="rank"
            />
          </TabPane>
          <TabPane tab={<><FireOutlined /> 距离排行</>} key="distance">
            <Table
              columns={columns}
              dataSource={rankings.distanceRankings}
              pagination={false}
              rowKey="rank"
            />
          </TabPane>
          <TabPane tab={<><FireOutlined /> 卡路里排行</>} key="calories">
            <Table
              columns={columns}
              dataSource={rankings.caloriesRankings}
              pagination={false}
              rowKey="rank"
            />
          </TabPane>
          <TabPane tab={<><HeartOutlined /> 心率排行</>} key="heartrate">
            <Table
              columns={columns}
              dataSource={rankings.heartRateRankings}
              pagination={false}
              rowKey="rank"
            />
          </TabPane>
          <TabPane tab="睡眠排行" key="sleep">
            <Table
              columns={columns}
              dataSource={rankings.sleepRankings}
              pagination={false}
              rowKey="rank"
            />
          </TabPane>
          <TabPane tab="运动排行" key="workout">
            <Table
              columns={columns}
              dataSource={rankings.workoutRankings}
              pagination={false}
              rowKey="rank"
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Rankings;

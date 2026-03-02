import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Spin, Alert, Progress, Space } from 'antd';
import { FireOutlined, EnvironmentOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { locationBehaviorApi } from '../services/locationBehaviorApi';
import type { HabitWithLocation } from '../types/locationBehavior';
import { LOCATION_LABEL_COLORS, LOCATION_LABEL_NAMES } from '../types/locationBehavior';

const HABIT_TYPE_NAMES: Record<string, string> = {
  HIGH_ENTERTAINMENT: '高娱乐使用',
  HIGH_PRODUCTIVITY: '高生产力',
  FREQUENT_SWITCHING: '频繁切换',
  LONG_FOCUS: '长时间专注',
};

const HABIT_TYPE_COLORS: Record<string, string> = {
  HIGH_ENTERTAINMENT: '#eb2f96',
  HIGH_PRODUCTIVITY: '#52c41a',
  FREQUENT_SWITCHING: '#faad14',
  LONG_FOCUS: '#1890ff',
};

const HabitsDashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [habits, setHabits] = useState<HabitWithLocation[]>([]);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await locationBehaviorApi.getHabits();
      setHabits(data);
    } catch (err) {
      setError('加载习惯数据失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<HabitWithLocation> = [
    {
      title: '地点',
      key: 'location',
      width: 150,
      render: (record: HabitWithLocation) => (
        <Space>
          <EnvironmentOutlined />
          <Tag color={LOCATION_LABEL_COLORS[record.locationLabel as keyof typeof LOCATION_LABEL_COLORS]}>
            {LOCATION_LABEL_NAMES[record.locationLabel as keyof typeof LOCATION_LABEL_NAMES] || record.locationLabel}
          </Tag>
        </Space>
      ),
    },
    {
      title: '习惯类型',
      dataIndex: 'habitType',
      key: 'habitType',
      width: 150,
      filters: [
        { text: '高娱乐使用', value: 'HIGH_ENTERTAINMENT' },
        { text: '高生产力', value: 'HIGH_PRODUCTIVITY' },
        { text: '频繁切换', value: 'FREQUENT_SWITCHING' },
        { text: '长时间专注', value: 'LONG_FOCUS' },
      ],
      onFilter: (value, record) => record.habitType === value,
      render: (habitType: string) => (
        <Tag color={HABIT_TYPE_COLORS[habitType]} icon={<FireOutlined />}>
          {HABIT_TYPE_NAMES[habitType] || habitType}
        </Tag>
      ),
    },
    {
      title: '习惯描述',
      dataIndex: 'habitDescription',
      key: 'habitDescription',
      ellipsis: true,
    },
    {
      title: '置信度',
      dataIndex: 'confidence',
      key: 'confidence',
      width: 150,
      sorter: (a, b) => a.confidence - b.confidence,
      render: (confidence: number) => (
        <Progress
          percent={Math.round(confidence * 100)}
          size="small"
          strokeColor={confidence > 0.7 ? '#52c41a' : confidence > 0.5 ? '#faad14' : '#ff4d4f'}
        />
      ),
    },
    {
      title: '出现次数',
      dataIndex: 'occurrenceCount',
      key: 'occurrenceCount',
      width: 120,
      sorter: (a, b) => a.occurrenceCount - b.occurrenceCount,
      render: (count: number) => <span style={{ fontWeight: 500 }}>{count}次</span>,
    },
  ];

  // Statistics
  const stats = {
    total: habits.length,
    highProductivity: habits.filter(h => h.habitType === 'HIGH_PRODUCTIVITY').length,
    highEntertainment: habits.filter(h => h.habitType === 'HIGH_ENTERTAINMENT').length,
    longFocus: habits.filter(h => h.habitType === 'LONG_FOCUS').length,
    frequentSwitching: habits.filter(h => h.habitType === 'FREQUENT_SWITCHING').length,
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  if (error) {
    return <Alert message="错误" description={error} type="error" showIcon />;
  }

  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Statistics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 'bold', color: '#1890ff' }}>{stats.total}</div>
              <div style={{ color: '#8c8c8c' }}>总习惯数</div>
            </div>
          </Card>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 'bold', color: '#52c41a' }}>{stats.highProductivity}</div>
              <div style={{ color: '#8c8c8c' }}>高生产力</div>
            </div>
          </Card>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 'bold', color: '#1890ff' }}>{stats.longFocus}</div>
              <div style={{ color: '#8c8c8c' }}>长时间专注</div>
            </div>
          </Card>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 'bold', color: '#eb2f96' }}>{stats.highEntertainment}</div>
              <div style={{ color: '#8c8c8c' }}>高娱乐使用</div>
            </div>
          </Card>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 'bold', color: '#faad14' }}>{stats.frequentSwitching}</div>
              <div style={{ color: '#8c8c8c' }}>频繁切换</div>
            </div>
          </Card>
        </div>

        {/* Habits Table */}
        <Card title="地点特定习惯" bordered={false}>
          <Table
            columns={columns}
            dataSource={habits}
            rowKey={(record) => `${record.locationId}-${record.habitType}`}
            pagination={{
              pageSize: 20,
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 条习惯`,
            }}
          />
        </Card>
      </Space>
    </div>
  );
};

export default HabitsDashboard;

import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Spin, Alert, Tabs, Progress } from 'antd';
import { TrophyOutlined, EnvironmentOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { locationBehaviorApi } from '../services/locationBehaviorApi';
import type { LocationWithEfficiency } from '../types/locationBehavior';
import { LOCATION_LABEL_COLORS, LOCATION_LABEL_NAMES } from '../types/locationBehavior';

const LocationRankings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [topEfficient, setTopEfficient] = useState<LocationWithEfficiency[]>([]);
  const [leastEfficient, setLeastEfficient] = useState<LocationWithEfficiency[]>([]);

  useEffect(() => {
    fetchRankings();
  }, []);

  const fetchRankings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await locationBehaviorApi.getRankings(10);
      setTopEfficient(data.topEfficient);
      setLeastEfficient(data.leastEfficient);
    } catch (err) {
      setError('加载排行榜失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<LocationWithEfficiency> = [
    {
      title: '排名',
      key: 'rank',
      width: 80,
      render: (_: any, __: any, index: number) => {
        if (index === 0) return <TrophyOutlined style={{ color: '#FFD700', fontSize: 20 }} />;
        if (index === 1) return <TrophyOutlined style={{ color: '#C0C0C0', fontSize: 18 }} />;
        if (index === 2) return <TrophyOutlined style={{ color: '#CD7F32', fontSize: 16 }} />;
        return <span style={{ color: '#8c8c8c' }}>#{index + 1}</span>;
      },
    },
    {
      title: '地点',
      key: 'location',
      render: (record: LocationWithEfficiency) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            <EnvironmentOutlined style={{ marginRight: 4 }} />
            {record.label !== 'UNKNOWN' && record.label !== 'OTHER'
              ? LOCATION_LABEL_NAMES[record.label as keyof typeof LOCATION_LABEL_NAMES]
              : `地点 #${record.id}`}
          </div>
          <div style={{ fontSize: 12, color: '#8c8c8c' }}>
            {record.centerLat.toFixed(4)}, {record.centerLon.toFixed(4)}
          </div>
        </div>
      ),
    },
    {
      title: '标签',
      dataIndex: 'label',
      key: 'label',
      width: 100,
      render: (label: string, record: LocationWithEfficiency) => (
        <Tag color={LOCATION_LABEL_COLORS[label as keyof typeof LOCATION_LABEL_COLORS]}>
          {LOCATION_LABEL_NAMES[label as keyof typeof LOCATION_LABEL_NAMES]}
        </Tag>
      ),
    },
    {
      title: '综合效率',
      key: 'efficiency',
      width: 150,
      sorter: (a, b) => a.efficiencyScore.efficiencyScore - b.efficiencyScore.efficiencyScore,
      render: (record: LocationWithEfficiency) => (
        <div>
          <Progress
            percent={Math.round(record.efficiencyScore.efficiencyScore)}
            size="small"
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
          />
        </div>
      ),
    },
    {
      title: '生产力',
      key: 'productivity',
      width: 100,
      render: (record: LocationWithEfficiency) => (
        <span>{record.efficiencyScore.productivityScore.toFixed(1)}</span>
      ),
    },
    {
      title: '健康',
      key: 'health',
      width: 100,
      render: (record: LocationWithEfficiency) => (
        <span>{record.efficiencyScore.healthScore.toFixed(1)}</span>
      ),
    },
    {
      title: '专注',
      key: 'focus',
      width: 100,
      render: (record: LocationWithEfficiency) => (
        <span>{record.efficiencyScore.focusScore.toFixed(1)}</span>
      ),
    },
    {
      title: '访问次数',
      dataIndex: 'visitCount',
      key: 'visitCount',
      width: 100,
      sorter: (a, b) => a.visitCount - b.visitCount,
    },
    {
      title: '平均时长',
      key: 'avgDuration',
      width: 120,
      render: (record: LocationWithEfficiency) => {
        const hours = Math.floor(record.efficiencyScore.avgDuration / 3600);
        const minutes = Math.floor((record.efficiencyScore.avgDuration % 3600) / 60);
        return <span>{hours}h {minutes}m</span>;
      },
    },
  ];

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
      <Card title="地点效率排行榜" bordered={false}>
        <Tabs
          defaultActiveKey="top"
          items={[
            {
              key: 'top',
              label: (
                <span>
                  <TrophyOutlined />
                  高效地点 Top 10
                </span>
              ),
              children: (
                <Table
                  columns={columns}
                  dataSource={topEfficient}
                  rowKey="id"
                  pagination={false}
                  size="middle"
                />
              ),
            },
            {
              key: 'least',
              label: '低效地点 Bottom 10',
              children: (
                <Table
                  columns={columns}
                  dataSource={leastEfficient}
                  rowKey="id"
                  pagination={false}
                  size="middle"
                />
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default LocationRankings;

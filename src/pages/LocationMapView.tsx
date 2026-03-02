import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Spin, Alert, Space, Button, Statistic, Row, Col } from 'antd';
import { EnvironmentOutlined, FireOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { locationBehaviorApi } from '../services/locationBehaviorApi';
import type { LocationWithEfficiency } from '../types/locationBehavior';
import { LOCATION_LABEL_COLORS, LOCATION_LABEL_NAMES } from '../types/locationBehavior';

const LocationMapView: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locations, setLocations] = useState<LocationWithEfficiency[]>([]);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await locationBehaviorApi.getLocations();
      setLocations(data);
    } catch (err) {
      setError('加载地点数据失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      await locationBehaviorApi.analyzeLocations();
      await fetchLocations();
    } catch (err) {
      setError('分析失败');
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const columns: ColumnsType<LocationWithEfficiency> = [
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
      width: 120,
      filters: [
        { text: '家', value: 'HOME' },
        { text: '办公室', value: 'OFFICE' },
        { text: '咖啡馆', value: 'CAFE' },
        { text: '健身房', value: 'GYM' },
        { text: '交通', value: 'TRANSIT' },
        { text: '休闲', value: 'LEISURE' },
        { text: '其他', value: 'OTHER' },
      ],
      onFilter: (value, record) => record.label === value,
      render: (label: string) => (
        <Tag color={LOCATION_LABEL_COLORS[label as keyof typeof LOCATION_LABEL_COLORS]}>
          {LOCATION_LABEL_NAMES[label as keyof typeof LOCATION_LABEL_NAMES]}
        </Tag>
      ),
    },
    {
      title: '综合效率',
      key: 'efficiency',
      width: 120,
      sorter: (a, b) => a.efficiencyScore.efficiencyScore - b.efficiencyScore.efficiencyScore,
      render: (record: LocationWithEfficiency) => {
        const score = record.efficiencyScore.efficiencyScore;
        let color = '#52c41a';
        if (score < 40) color = '#ff4d4f';
        else if (score < 60) color = '#faad14';
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: color,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                marginRight: 8,
              }}
            >
              {Math.round(score)}
            </div>
            <FireOutlined style={{ color, fontSize: 16 }} />
          </div>
        );
      },
    },
    {
      title: '访问次数',
      dataIndex: 'visitCount',
      key: 'visitCount',
      width: 100,
      sorter: (a, b) => a.visitCount - b.visitCount,
    },
    {
      title: '习惯数',
      key: 'habits',
      width: 100,
      render: (record: LocationWithEfficiency) => (
        <span>{record.habits?.length || 0}</span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (record: LocationWithEfficiency) => (
        <Button type="link" onClick={() => navigate(`/location-behavior/detail/${record.id}`)}>
          查看详情
        </Button>
      ),
    },
  ];

  // Calculate statistics
  const stats = {
    total: locations.length,
    avgEfficiency: locations.length > 0
      ? locations.reduce((sum, loc) => sum + loc.efficiencyScore.efficiencyScore, 0) / locations.length
      : 0,
    totalVisits: locations.reduce((sum, loc) => sum + loc.visitCount, 0),
    totalHabits: locations.reduce((sum, loc) => sum + (loc.habits?.length || 0), 0),
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
        {/* Statistics */}
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic
                title="地点总数"
                value={stats.total}
                prefix={<EnvironmentOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="平均效率"
                value={stats.avgEfficiency.toFixed(1)}
                suffix="/ 100"
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="总访问次数"
                value={stats.totalVisits}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="检测到的习惯"
                value={stats.totalHabits}
                prefix={<FireOutlined />}
                valueStyle={{ color: '#eb2f96' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Locations Table */}
        <Card
          title="地点列表"
          bordered={false}
          extra={
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              loading={analyzing}
              onClick={handleAnalyze}
            >
              重新分析
            </Button>
          }
        >
          <Table
            columns={columns}
            dataSource={locations}
            rowKey="id"
            pagination={{
              pageSize: 20,
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 个地点`,
            }}
          />
        </Card>

        {/* Note about map */}
        <Alert
          message="地图视图"
          description="完整的交互式地图视图需要集成Leaflet或Mapbox库。当前显示的是地点列表视图，包含所有关键信息。"
          type="info"
          showIcon
        />
      </Space>
    </div>
  );
};

export default LocationMapView;

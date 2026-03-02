import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Spin, Alert, Descriptions, Tag, Space, Row, Col, Progress } from 'antd';
import { EnvironmentOutlined, ClockCircleOutlined, FireOutlined } from '@ant-design/icons';
import { Radar } from '@ant-design/plots';
import { locationBehaviorApi } from '../services/locationBehaviorApi';
import type { LocationWithEfficiency } from '../types/locationBehavior';
import { LOCATION_LABEL_COLORS, LOCATION_LABEL_NAMES } from '../types/locationBehavior';

const LocationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationWithEfficiency | null>(null);

  useEffect(() => {
    if (id) {
      fetchLocationDetail(parseInt(id));
    }
  }, [id]);

  const fetchLocationDetail = async (locationId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await locationBehaviorApi.getLocationById(locationId);
      setLocation(data);
    } catch (err) {
      setError('加载地点详情失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  if (error || !location) {
    return <Alert message="错误" description={error || '地点不存在'} type="error" showIcon />;
  }

  // Prepare radar chart data
  const radarData = [
    { dimension: '生产力', value: location.efficiencyScore.productivityScore },
    { dimension: '健康', value: location.efficiencyScore.healthScore },
    { dimension: '专注', value: location.efficiencyScore.focusScore },
  ];

  const radarConfig = {
    data: radarData,
    xField: 'dimension',
    yField: 'value',
    meta: {
      value: {
        alias: '评分',
        min: 0,
        max: 100,
      },
    },
    xAxis: {
      line: null,
      tickLine: null,
    },
    yAxis: {
      label: false,
      grid: {
        alternateColor: 'rgba(0, 0, 0, 0.04)',
      },
    },
    point: {
      size: 4,
    },
    area: {},
  };

  const avgDurationHours = Math.floor(location.efficiencyScore.avgDuration / 3600);
  const avgDurationMinutes = Math.floor((location.efficiencyScore.avgDuration % 3600) / 60);

  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Header Card */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ margin: 0 }}>
                <EnvironmentOutlined style={{ marginRight: 8 }} />
                {location.label !== 'UNKNOWN' && location.label !== 'OTHER'
                  ? LOCATION_LABEL_NAMES[location.label as keyof typeof LOCATION_LABEL_NAMES]
                  : `地点 #${location.id}`}
              </h2>
              <div style={{ color: '#8c8c8c', marginTop: 8 }}>
                {location.centerLat.toFixed(6)}, {location.centerLon.toFixed(6)}
              </div>
            </div>
            <Tag color={LOCATION_LABEL_COLORS[location.label as keyof typeof LOCATION_LABEL_COLORS]} style={{ fontSize: 16, padding: '4px 12px' }}>
              {LOCATION_LABEL_NAMES[location.label as keyof typeof LOCATION_LABEL_NAMES]}
            </Tag>
          </div>
        </Card>

        {/* Efficiency Score Card */}
        <Card title="综合效率评分" bordered={false}>
          <Row gutter={24}>
            <Col span={12}>
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <Progress
                  type="circle"
                  percent={Math.round(location.efficiencyScore.efficiencyScore)}
                  width={200}
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                  format={(percent) => (
                    <div>
                      <div style={{ fontSize: 48, fontWeight: 'bold' }}>{percent}</div>
                      <div style={{ fontSize: 14, color: '#8c8c8c' }}>综合评分</div>
                    </div>
                  )}
                />
              </div>
            </Col>
            <Col span={12}>
              <Radar {...radarConfig} height={250} />
            </Col>
          </Row>
        </Card>

        {/* Details Card */}
        <Card title="地点信息" bordered={false}>
          <Descriptions column={2} bordered>
            <Descriptions.Item label="访问次数">
              <span style={{ fontWeight: 500, fontSize: 16 }}>{location.visitCount}次</span>
            </Descriptions.Item>
            <Descriptions.Item label="平均停留时长">
              <ClockCircleOutlined style={{ marginRight: 4 }} />
              {avgDurationHours}小时 {avgDurationMinutes}分钟
            </Descriptions.Item>
            <Descriptions.Item label="首次访问">
              {new Date(location.firstVisit).toLocaleString('zh-CN')}
            </Descriptions.Item>
            <Descriptions.Item label="最近访问">
              {new Date(location.lastVisit).toLocaleString('zh-CN')}
            </Descriptions.Item>
            <Descriptions.Item label="覆盖半径">
              {location.radius.toFixed(0)}米
            </Descriptions.Item>
            <Descriptions.Item label="标注置信度">
              <Progress
                percent={Math.round(location.labelConfidence * 100)}
                size="small"
                style={{ width: 200 }}
              />
            </Descriptions.Item>
            <Descriptions.Item label="生产力评分">
              <span style={{ fontSize: 16, fontWeight: 500, color: '#52c41a' }}>
                {location.efficiencyScore.productivityScore.toFixed(1)}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="健康评分">
              <span style={{ fontSize: 16, fontWeight: 500, color: '#1890ff' }}>
                {location.efficiencyScore.healthScore.toFixed(1)}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="专注评分">
              <span style={{ fontSize: 16, fontWeight: 500, color: '#722ed1' }}>
                {location.efficiencyScore.focusScore.toFixed(1)}
              </span>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Habits Card */}
        {location.habits && location.habits.length > 0 && (
          <Card title={<span><FireOutlined /> 地点特定习惯</span>} bordered={false}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {location.habits.map((habit, index) => (
                <Card key={index} size="small" style={{ backgroundColor: '#fafafa' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, marginBottom: 8 }}>
                        {habit.habitDescription}
                      </div>
                      <Space>
                        <Tag color="blue">出现{habit.occurrenceCount}次</Tag>
                        <Tag color="green">置信度 {(habit.confidence * 100).toFixed(0)}%</Tag>
                      </Space>
                    </div>
                    <Progress
                      type="circle"
                      percent={Math.round(habit.confidence * 100)}
                      width={60}
                      strokeColor="#52c41a"
                    />
                  </div>
                </Card>
              ))}
            </Space>
          </Card>
        )}
      </Space>
    </div>
  );
};

export default LocationDetail;

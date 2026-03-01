import React, { useEffect, useState } from 'react';
import { Row, Col, Card, DatePicker, Spin, message, Table, Tag } from 'antd';
import { HeartOutlined, WarningOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import HealthMetricCard from '../components/HealthMetricCard';
import HeartRateChart from '../components/HeartRateChart';
import ZoneDistribution from '../components/ZoneDistribution';
import { healthApiService } from '../services/healthApiService';
import { METRIC_TYPES } from '../config/metricTypes';
import { formatBPM, formatDateTime, getSeverityColor } from '../utils/heartRateUtils';
import type { HealthStatistics, HeartRateZones, Anomaly, DailyPattern } from '../types/health';

const { RangePicker } = DatePicker;

const HeartRate: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'days'),
    dayjs(),
  ]);
  const [statistics, setStatistics] = useState<HealthStatistics[]>([]);
  const [zones, setZones] = useState<HeartRateZones | null>(null);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [dailyPattern, setDailyPattern] = useState<DailyPattern | null>(null);

  useEffect(() => {
    loadData();
  }, [dateRange]);

  const loadData = async () => {
    try {
      setLoading(true);
      const startDate = dateRange[0].format('YYYY-MM-DD');
      const endDate = dateRange[1].format('YYYY-MM-DD');

      const [statsData, zonesData, anomaliesData, patternData] = await Promise.all([
        healthApiService.getDailyStatistics(METRIC_TYPES.HEART_RATE, startDate, endDate),
        healthApiService.getHeartRateZones(startDate, endDate),
        healthApiService.getHeartRateAnomalies(startDate, endDate),
        healthApiService.getDailyActivityPattern(),
      ]);

      setStatistics(statsData.statistics);
      setZones(zonesData);
      setAnomalies(anomaliesData.anomalies);
      setDailyPattern(patternData);
    } catch (error) {
      message.error('加载数据失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const avgHeartRate = statistics.length > 0
    ? (statistics.reduce((sum, stat) => sum + stat.avgValue, 0) / statistics.length).toFixed(1)
    : '0';

  const restingHeartRate = statistics.length > 0
    ? Math.min(...statistics.map(s => s.minValue)).toFixed(1)
    : '0';

  const peakHeartRate = statistics.length > 0
    ? Math.max(...statistics.map(s => s.maxValue)).toFixed(1)
    : '0';

  const anomalyColumns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text: string) => formatDateTime(text),
    },
    {
      title: '心率',
      dataIndex: 'value',
      key: 'value',
      render: (value: number) => formatBPM(value),
    },
    {
      title: '原因',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: '严重程度',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: string) => (
        <Tag color={getSeverityColor(severity)}>
          {severity === 'high' ? '高' : severity === 'medium' ? '中' : '低'}
        </Tag>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1>心率分析</h1>
        <RangePicker
          value={dateRange}
          onChange={(dates) => dates && setDateRange(dates as [Dayjs, Dayjs])}
          format="YYYY-MM-DD"
        />
      </div>

      {/* Metric Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <HealthMetricCard
            title="平均心率"
            value={avgHeartRate}
            unit="BPM"
            icon={<HeartOutlined />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={8}>
          <HealthMetricCard
            title="静息心率"
            value={restingHeartRate}
            unit="BPM"
            icon={<HeartOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={8}>
          <HealthMetricCard
            title="峰值心率"
            value={peakHeartRate}
            unit="BPM"
            icon={<HeartOutlined />}
            color="#f5222d"
          />
        </Col>
      </Row>

      {/* Heart Rate Trend */}
      <Card title="心率趋势" style={{ marginBottom: '24px' }}>
        <HeartRateChart data={statistics} height={350} />
      </Card>

      {/* Zone Distribution and Hourly Pattern */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <Card title="心率区间分布">
            {zones && <ZoneDistribution zones={zones.zones} height={300} />}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="每小时活动模式">
            {dailyPattern && (
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {dailyPattern.hours.map((hour) => (
                  <div
                    key={hour.hour}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '8px 0',
                      borderBottom: '1px solid #f0f0f0',
                    }}
                  >
                    <span>{hour.hour}:00</span>
                    <span>{formatBPM(hour.avgHeartRate)}</span>
                    <span style={{ color: '#8c8c8c' }}>{hour.count} 次</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Anomalies */}
      {anomalies.length > 0 && (
        <Card
          title={
            <span>
              <WarningOutlined style={{ marginRight: '8px', color: '#faad14' }} />
              异常心率检测
            </span>
          }
        >
          <Table
            dataSource={anomalies}
            columns={anomalyColumns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </Card>
      )}
    </div>
  );
};

export default HeartRate;

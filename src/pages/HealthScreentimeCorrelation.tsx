import React, { useEffect, useState } from 'react';
import { Card, Spin, Alert, Row, Col, Statistic, Tabs, Table, Tag, Progress } from 'antd';
import { WarningOutlined, CheckCircleOutlined } from '@ant-design/icons';
import {
  ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { healthApiService } from '../services/healthApiService';

const HealthScreentimeCorrelation: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await healthApiService.getHealthScreentimeCorrelation();
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

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'default';
    }
  };

  const sedentaryColumns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '屏幕时间(小时)',
      dataIndex: 'screen_hours',
      key: 'screen_hours',
      render: (val: number) => val.toFixed(1),
    },
    {
      title: '步数',
      dataIndex: 'steps',
      key: 'steps',
    },
    {
      title: '风险等级',
      dataIndex: 'risk_level',
      key: 'risk_level',
      render: (level: string) => (
        <Tag color={getRiskColor(level)}>
          {level === 'high' ? '高' : level === 'medium' ? '中' : '低'}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h1>健康×屏幕时间关联分析</h1>

      {/* 健康屏幕平衡评分 */}
      <Card title="健康屏幕平衡评分" style={{ marginBottom: '24px' }}>
        <Row gutter={16}>
          <Col span={8}>
            <div style={{ textAlign: 'center' }}>
              <Progress
                type="circle"
                percent={data.health_screentime_balance.balance_score}
                format={(percent) => `${percent?.toFixed(0)}`}
                strokeColor={
                  data.health_screentime_balance.balance_score >= 80 ? '#52c41a' :
                  data.health_screentime_balance.balance_score >= 60 ? '#faad14' : '#ff4d4f'
                }
              />
            </div>
          </Col>
          <Col span={16}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="健康天数"
                  value={data.health_screentime_balance.healthy_days}
                  suffix="天"
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="不健康天数"
                  value={data.health_screentime_balance.unhealthy_days}
                  suffix="天"
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="推荐屏幕时间"
                  value={data.health_screentime_balance.recommended_screen.toFixed(1)}
                  suffix="小时/天"
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="当前平均屏幕时间"
                  value={data.health_screentime_balance.current_avg_screen.toFixed(1)}
                  suffix="小时/天"
                  valueStyle={{
                    color: data.health_screentime_balance.current_avg_screen >
                           data.health_screentime_balance.recommended_screen ? '#ff4d4f' : '#52c41a'
                  }}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      {/* 久坐分析 */}
      <Card title="久坐行为分析" style={{ marginBottom: '24px' }}>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="久坐天数"
              value={data.sedentary_analysis.total_sedentary_days}
              suffix="天"
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="久坐率"
              value={data.sedentary_analysis.sedentary_rate.toFixed(1)}
              suffix="%"
              valueStyle={{
                color: data.sedentary_analysis.sedentary_rate > 50 ? '#ff4d4f' : '#52c41a'
              }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="平均久坐时长"
              value={data.sedentary_analysis.avg_sedentary_hours.toFixed(1)}
              suffix="小时"
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="高风险天数"
              value={data.sedentary_analysis.high_risk_days}
              suffix="天"
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Col>
        </Row>
      </Card>

      {/* 活动相关性 */}
      <Card title="活动量与屏幕时间相关性" style={{ marginBottom: '24px' }}>
        <Row gutter={16}>
          <Col span={8}>
            <Statistic
              title="相关系数"
              value={data.activity_correlation.correlation_coefficient.toFixed(3)}
              valueStyle={{
                color: data.activity_correlation.correlation_coefficient < 0 ? '#52c41a' : '#ff4d4f'
              }}
            />
            <div style={{ marginTop: '8px', textAlign: 'center' }}>
              <Tag color={
                data.activity_correlation.correlation_type === 'negative' ? 'green' :
                data.activity_correlation.correlation_type === 'positive' ? 'red' : 'default'
              }>
                {data.activity_correlation.correlation_type === 'negative' ? '负相关(好)' :
                 data.activity_correlation.correlation_type === 'positive' ? '正相关(差)' : '无相关'}
              </Tag>
            </div>
          </Col>
          <Col span={8}>
            <Statistic
              title="高屏幕时间日平均步数"
              value={data.activity_correlation.avg_steps_high_screen.toFixed(0)}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="低屏幕时间日平均步数"
              value={data.activity_correlation.avg_steps_low_screen.toFixed(0)}
            />
          </Col>
        </Row>
      </Card>

      {/* 睡眠影响 */}
      <Card title="深夜屏幕使用对睡眠的影响" style={{ marginBottom: '24px' }}>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="深夜使用天数"
              value={data.sleep_impact.late_night_screen_days}
              suffix="天"
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="睡眠质量影响"
              value={data.sleep_impact.sleep_quality_impact.toFixed(1)}
              suffix="小时"
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: '#666' }}>影响等级</div>
              <Tag
                color={getRiskColor(data.sleep_impact.impact_level)}
                style={{ marginTop: '8px', fontSize: '16px' }}
              >
                {data.sleep_impact.impact_level === 'high' ? '高影响' :
                 data.sleep_impact.impact_level === 'medium' ? '中影响' : '低影响'}
              </Tag>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 建议 */}
      <Card
        title={
          <span>
            <CheckCircleOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
            健康建议
          </span>
        }
        style={{ marginBottom: '24px' }}
      >
        <ul>
          {data.recommendations.map((rec: string, idx: number) => (
            <li key={idx} style={{ marginBottom: '8px' }}>{rec}</li>
          ))}
        </ul>
      </Card>

      {/* Tabs */}
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="久坐日详情" key="1">
          <Table
            columns={sedentaryColumns}
            dataSource={data.sedentary_analysis.sedentary_day_details}
            rowKey="date"
            pagination={{ pageSize: 10 }}
          />
        </Tabs.TabPane>

        <Tabs.TabPane tab="活动与屏幕时间散点图" key="2">
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
              <CartesianGrid />
              <XAxis dataKey="screen_hours" name="屏幕时间" unit="小时" />
              <YAxis dataKey="steps" name="步数" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter
                name="每日数据"
                data={data.activity_correlation.daily_comparison}
                fill="#8884d8"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default HealthScreentimeCorrelation;

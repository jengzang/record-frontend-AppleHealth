import React, { useEffect, useState } from 'react';
import { Card, Tabs, Spin, message, Row, Col } from 'antd';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { healthApiService } from '../services/healthApiService';
import type { HealthStatistics, RestingHR, WeeklyPattern } from '../types/health';

const Trends: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('daily');
  const [dailyStats, setDailyStats] = useState<HealthStatistics[]>([]);
  const [restingHR, setRestingHR] = useState<RestingHR[]>([]);
  const [weeklyPattern, setWeeklyPattern] = useState<WeeklyPattern | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const [statsData, restingData, patternData] = await Promise.all([
        healthApiService.getDailyStatistics('HeartRate', startDate, endDate),
        healthApiService.getRestingHeartRate(startDate, endDate),
        healthApiService.getWeeklyActivityPattern(),
      ]);

      setDailyStats(statsData.statistics);
      setRestingHR(restingData.data);
      setWeeklyPattern(patternData);
    } catch (error) {
      message.error('加载数据失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const dailyChartData = dailyStats.map((stat) => ({
    date: stat.statDate,
    avgHR: Math.round(stat.avgValue),
  }));

  const restingChartData = restingHR.map((hr) => ({
    date: hr.date,
    restingHR: Math.round(hr.restingBpm),
  }));

  const weeklyChartData = weeklyPattern?.days.map((day) => ({
    weekday: day.weekday,
    avgHR: Math.round(day.avgHeartRate),
    count: day.count,
  })) || [];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px' }}>趋势分析</h1>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.TabPane tab="每日趋势" key="daily">
          <Card>
            <h3 style={{ marginBottom: '16px' }}>平均心率 - 最近90天</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={dailyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis label={{ value: 'BPM', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  labelFormatter={(value) => {
                    const date = new Date(value as string);
                    return date.toLocaleDateString('zh-CN');
                  }}
                  formatter={(value: number | undefined) => (value !== undefined ? [`${value} BPM`, '平均心率'] : ['', '平均心率'])}
                />
                <Legend />
                <Line type="monotone" dataKey="avgHR" stroke="#1890ff" strokeWidth={2} name="平均心率" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Tabs.TabPane>

        <Tabs.TabPane tab="静息心率" key="resting">
          <Card>
            <h3 style={{ marginBottom: '16px' }}>静息心率趋势 - 最近90天</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={restingChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis label={{ value: 'BPM', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  labelFormatter={(value) => {
                    const date = new Date(value as string);
                    return date.toLocaleDateString('zh-CN');
                  }}
                  formatter={(value: number | undefined) => (value !== undefined ? [`${value} BPM`, '静息心率'] : ['', '静息心率'])}
                />
                <Legend />
                <Line type="monotone" dataKey="restingHR" stroke="#52c41a" strokeWidth={2} name="静息心率" />
              </LineChart>
            </ResponsiveContainer>

            <div style={{ marginTop: '24px', padding: '16px', background: '#f0f2f5', borderRadius: '8px' }}>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                      {restingHR.length > 0 ? Math.round(restingHR[restingHR.length - 1].restingBpm) : '-'}
                    </div>
                    <div style={{ color: '#8c8c8c' }}>当前静息心率</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                      {restingHR.length > 0
                        ? Math.round(restingHR.reduce((sum, hr) => sum + hr.restingBpm, 0) / restingHR.length)
                        : '-'}
                    </div>
                    <div style={{ color: '#8c8c8c' }}>平均静息心率</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>
                      {restingHR.length > 0 ? Math.min(...restingHR.map(hr => Math.round(hr.restingBpm))) : '-'}
                    </div>
                    <div style={{ color: '#8c8c8c' }}>最低静息心率</div>
                  </div>
                </Col>
              </Row>
            </div>
          </Card>
        </Tabs.TabPane>

        <Tabs.TabPane tab="每周模式" key="weekly">
          <Card>
            <h3 style={{ marginBottom: '16px' }}>每周活动模式</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={weeklyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="weekday" />
                <YAxis yAxisId="left" label={{ value: 'BPM', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: '测量次数', angle: 90, position: 'insideRight' }} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="avgHR" fill="#1890ff" name="平均心率" />
                <Bar yAxisId="right" dataKey="count" fill="#52c41a" name="测量次数" />
              </BarChart>
            </ResponsiveContainer>

            {weeklyPattern && (
              <div style={{ marginTop: '24px', padding: '16px', background: '#f0f2f5', borderRadius: '8px' }}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#52c41a' }}>
                        {weeklyPattern.mostActiveDay}
                      </div>
                      <div style={{ color: '#8c8c8c' }}>最活跃日</div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#8c8c8c' }}>
                        {weeklyPattern.leastActiveDay}
                      </div>
                      <div style={{ color: '#8c8c8c' }}>最不活跃日</div>
                    </div>
                  </Col>
                </Row>
              </div>
            )}
          </Card>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Trends;

import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spin, message, Progress } from 'antd';
import { TrophyOutlined, HeartOutlined, LineChartOutlined } from '@ant-design/icons';
import HealthScoreGauge from '../components/HealthScoreGauge';
import { healthApiService } from '../services/healthApiService';
import { getGradeColor } from '../utils/heartRateUtils';
import type { HealthScore, DailyPattern, WeeklyPattern } from '../types/health';

const Analysis: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [healthScore, setHealthScore] = useState<HealthScore | null>(null);
  const [dailyPattern, setDailyPattern] = useState<DailyPattern | null>(null);
  const [weeklyPattern, setWeeklyPattern] = useState<WeeklyPattern | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [scoreData, dailyData, weeklyData] = await Promise.all([
        healthApiService.getHealthScore(),
        healthApiService.getDailyActivityPattern(),
        healthApiService.getWeeklyActivityPattern(),
      ]);

      setHealthScore(scoreData);
      setDailyPattern(dailyData);
      setWeeklyPattern(weeklyData);
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

  const peakHour = dailyPattern?.peakHour ?? 0;
  const quietestHour = dailyPattern?.quietestHour ?? 0;

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px' }}>健康分析</h1>

      {/* Health Score */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={8}>
          <Card>
            {healthScore && (
              <HealthScoreGauge
                score={healthScore.overallScore}
                grade={healthScore.grade}
                size={220}
              />
            )}
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card title="评分细分" style={{ height: '100%' }}>
            {healthScore && (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>
                      <HeartOutlined style={{ marginRight: '8px', color: '#f5222d' }} />
                      静息心率评分
                    </span>
                    <span style={{ fontWeight: 'bold' }}>{Math.round(healthScore.restingHrScore)}/40</span>
                  </div>
                  <Progress
                    percent={(healthScore.restingHrScore / 40) * 100}
                    strokeColor="#f5222d"
                    showInfo={false}
                  />
                  <div style={{ marginTop: '4px', fontSize: '12px', color: '#8c8c8c' }}>
                    当前静息心率: {Math.round(healthScore.restingHr)} BPM
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>
                      <LineChartOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                      心率变异性评分
                    </span>
                    <span style={{ fontWeight: 'bold' }}>{Math.round(healthScore.variabilityScore)}/30</span>
                  </div>
                  <Progress
                    percent={(healthScore.variabilityScore / 30) * 100}
                    strokeColor="#1890ff"
                    showInfo={false}
                  />
                  <div style={{ marginTop: '4px', fontSize: '12px', color: '#8c8c8c' }}>
                    更高的变异性表示更好的心血管健康
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>
                      <TrophyOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
                      测量一致性评分
                    </span>
                    <span style={{ fontWeight: 'bold' }}>{Math.round(healthScore.consistencyScore)}/30</span>
                  </div>
                  <Progress
                    percent={(healthScore.consistencyScore / 30) * 100}
                    strokeColor="#52c41a"
                    showInfo={false}
                  />
                  <div style={{ marginTop: '4px', fontSize: '12px', color: '#8c8c8c' }}>
                    每日测量次数: {healthScore.measurementCount} 次
                  </div>
                </div>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Activity Pattern Summary */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="每日活动模式摘要">
            {dailyPattern && (
              <div>
                <div style={{ marginBottom: '16px', padding: '16px', background: '#f0f2f5', borderRadius: '8px' }}>
                  <div style={{ fontSize: '16px', marginBottom: '8px' }}>
                    <strong>最活跃时间:</strong> {peakHour}:00
                  </div>
                  <div style={{ fontSize: '16px', marginBottom: '8px' }}>
                    <strong>最安静时间:</strong> {quietestHour}:00
                  </div>
                  <div style={{ fontSize: '16px' }}>
                    <strong>总测量次数:</strong> {dailyPattern.totalReadings.toLocaleString()} 次
                  </div>
                </div>

                <div style={{ fontSize: '14px', color: '#8c8c8c' }}>
                  <p>💡 建议:</p>
                  <ul style={{ paddingLeft: '20px' }}>
                    <li>在 {peakHour}:00 左右进行高强度活动</li>
                    <li>在 {quietestHour}:00 左右安排休息时间</li>
                    <li>保持规律的作息时间以优化心血管健康</li>
                  </ul>
                </div>
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="每周活动模式摘要">
            {weeklyPattern && (
              <div>
                <div style={{ marginBottom: '16px', padding: '16px', background: '#f0f2f5', borderRadius: '8px' }}>
                  <div style={{ fontSize: '16px', marginBottom: '8px' }}>
                    <strong>最活跃日:</strong> {weeklyPattern.mostActiveDay}
                  </div>
                  <div style={{ fontSize: '16px', marginBottom: '8px' }}>
                    <strong>最不活跃日:</strong> {weeklyPattern.leastActiveDay}
                  </div>
                  <div style={{ fontSize: '16px' }}>
                    <strong>平均每日测量:</strong>{' '}
                    {Math.round(weeklyPattern.totalReadings / weeklyPattern.days.length).toLocaleString()} 次
                  </div>
                </div>

                <div style={{ fontSize: '14px', color: '#8c8c8c' }}>
                  <p>💡 建议:</p>
                  <ul style={{ paddingLeft: '20px' }}>
                    <li>在 {weeklyPattern.leastActiveDay} 增加活动量</li>
                    <li>保持每周至少5天的规律运动</li>
                    <li>周末和工作日保持相似的活动水平</li>
                  </ul>
                </div>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Health Score Interpretation */}
      {healthScore && (
        <Card title="健康评分解读" style={{ marginTop: '24px' }}>
          <div style={{ padding: '16px' }}>
            <div style={{ fontSize: '18px', marginBottom: '16px' }}>
              您的健康评分为{' '}
              <span style={{ fontWeight: 'bold', color: getGradeColor(healthScore.grade), fontSize: '24px' }}>
                {Math.round(healthScore.overallScore)} 分 ({healthScore.grade})
              </span>
            </div>

            <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
              {healthScore.overallScore >= 90 && (
                <p>🎉 优秀！您的心血管健康状况非常好。继续保持规律的运动和健康的生活方式。</p>
              )}
              {healthScore.overallScore >= 80 && healthScore.overallScore < 90 && (
                <p>👍 良好！您的心血管健康状况不错，可以通过增加运动强度和频率来进一步提升。</p>
              )}
              {healthScore.overallScore >= 70 && healthScore.overallScore < 80 && (
                <p>
                  ⚠️ 中等。建议增加有氧运动，保持规律的作息，并定期监测心率变化。
                </p>
              )}
              {healthScore.overallScore < 70 && (
                <p>
                  ⚠️ 需要改善。建议咨询医生，制定合适的运动计划，并注意心血管健康。
                </p>
              )}

              <div style={{ marginTop: '16px', padding: '12px', background: '#e6f7ff', borderRadius: '8px' }}>
                <strong>评分说明:</strong>
                <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                  <li>静息心率 (40%): 最佳范围 50-70 BPM</li>
                  <li>心率变异性 (30%): 更高的变异性表示更好的适应能力</li>
                  <li>测量一致性 (30%): 每日50+次测量为最佳</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Analysis;

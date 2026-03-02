import { useEffect, useState } from 'react';
import { efficiencyApiService } from '../services/efficiencyApiService';
import type { EfficiencyCurveProfile, EfficiencyInsight } from '../types/efficiency';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function EfficiencyCurveDashboard() {
  const [workdayProfile, setWorkdayProfile] = useState<EfficiencyCurveProfile | null>(null);
  const [weekendProfile, setWeekendProfile] = useState<EfficiencyCurveProfile | null>(null);
  const [insights, setInsights] = useState<EfficiencyInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [workday, weekend, insightsData] = await Promise.all([
        efficiencyApiService.getProfile('workday').catch(() => null),
        efficiencyApiService.getProfile('weekend').catch(() => null),
        efficiencyApiService.getInsights().catch(() => []),
      ]);

      setWorkdayProfile(workday);
      setWeekendProfile(weekend);
      setInsights(insightsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  const prepareRadarData = (profile: EfficiencyCurveProfile | null) => {
    if (!profile) return [];

    return profile.hourly_curve.map((score, hour) => ({
      hour: `${hour}:00`,
      efficiency: Math.round(score * 10) / 10,
    }));
  };

  const getChronotypeLabel = (chronotype: string) => {
    const labels: Record<string, string> = {
      morning: '早晨型',
      evening: '夜猫子型',
      intermediate: '中间型',
    };
    return labels[chronotype] || chronotype;
  };

  const getChronotypeColor = (chronotype: string) => {
    const colors: Record<string, string> = {
      morning: 'text-yellow-600',
      evening: 'text-purple-600',
      intermediate: 'text-blue-600',
    };
    return colors[chronotype] || 'text-gray-600';
  };

  const getPriorityBadge = (priority: number) => {
    const badges: Record<number, { label: string; color: string }> = {
      0: { label: '低', color: 'bg-gray-100 text-gray-800' },
      1: { label: '中', color: 'bg-blue-100 text-blue-800' },
      2: { label: '高', color: 'bg-red-100 text-red-800' },
    };
    return badges[priority] || badges[0];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  if (!workdayProfile && !weekendProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">暂无效率数据</p>
          <p className="text-sm text-gray-500">请先运行效率分析</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">个人效率曲线</h1>

      {/* Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Workday Profile */}
        {workdayProfile && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">工作日画像</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">生物钟类型</span>
                <span className={`font-semibold ${getChronotypeColor(workdayProfile.chronotype)}`}>
                  {getChronotypeLabel(workdayProfile.chronotype)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">置信度</span>
                <span className="font-semibold">
                  {(workdayProfile.chronotype_confidence * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">峰值时段</span>
                <span className="font-semibold">
                  {workdayProfile.peak_start_hour}:00 - {workdayProfile.peak_end_hour}:00
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">峰值效率</span>
                <span className="font-semibold text-green-600">
                  {workdayProfile.peak_score.toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">平均效率</span>
                <span className="font-semibold">
                  {workdayProfile.avg_efficiency.toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">数据样本</span>
                <span className="text-sm text-gray-500">
                  {workdayProfile.total_samples} 小时
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Weekend Profile */}
        {weekendProfile && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">周末画像</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">生物钟类型</span>
                <span className={`font-semibold ${getChronotypeColor(weekendProfile.chronotype)}`}>
                  {getChronotypeLabel(weekendProfile.chronotype)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">置信度</span>
                <span className="font-semibold">
                  {(weekendProfile.chronotype_confidence * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">峰值时段</span>
                <span className="font-semibold">
                  {weekendProfile.peak_start_hour}:00 - {weekendProfile.peak_end_hour}:00
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">峰值效率</span>
                <span className="font-semibold text-green-600">
                  {weekendProfile.peak_score.toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">平均效率</span>
                <span className="font-semibold">
                  {weekendProfile.avg_efficiency.toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">数据样本</span>
                <span className="text-sm text-gray-500">
                  {weekendProfile.total_samples} 小时
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Radar Chart */}
      {workdayProfile && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">24小时效率曲线</h2>
          <ResponsiveContainer width="100%" height={500}>
            <RadarChart data={prepareRadarData(workdayProfile)}>
              <PolarGrid />
              <PolarAngleAxis dataKey="hour" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar
                name="工作日"
                dataKey="efficiency"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
              />
              {weekendProfile && (
                <Radar
                  name="周末"
                  dataKey="efficiency"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                  data={prepareRadarData(weekendProfile)}
                />
              )}
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Insights */}
      {insights.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">效率洞察</h2>
          <div className="space-y-4">
            {insights.map((insight) => {
              const badge = getPriorityBadge(insight.priority);
              return (
                <div key={insight.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${badge.color}`}>
                      {badge.label}
                    </span>
                    <h3 className="font-semibold">{insight.title}</h3>
                  </div>
                  <p className="text-gray-700 mb-2">{insight.description}</p>
                  {insight.recommendation && (
                    <p className="text-sm text-blue-600">💡 {insight.recommendation}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    置信度: {(insight.confidence * 100).toFixed(0)}%
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

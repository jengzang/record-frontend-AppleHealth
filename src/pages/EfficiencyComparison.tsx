import { useEffect, useState } from 'react';
import { efficiencyApiService } from '../services/efficiencyApiService';
import type { ProfileComparisonResponse } from '../types/efficiency';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, BarChart } from 'recharts';

export default function EfficiencyComparison() {
  const [comparison, setComparison] = useState<ProfileComparisonResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await efficiencyApiService.getComparison();
      setComparison(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  const prepareLineChartData = () => {
    if (!comparison) return [];

    return Array.from({ length: 24 }, (_, hour) => ({
      hour: `${hour}:00`,
      workday: Math.round(comparison.workday.hourly_curve[hour] * 10) / 10,
      weekend: Math.round(comparison.weekend.hourly_curve[hour] * 10) / 10,
    }));
  };

  const prepareDiffChartData = () => {
    if (!comparison) return [];

    return Array.from({ length: 24 }, (_, hour) => ({
      hour: `${hour}:00`,
      diff: Math.round(comparison.diff.hourly_diff[hour] * 10) / 10,
    }));
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

  if (!comparison) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">暂无对比数据</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">工作日 vs 周末对比</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm text-gray-600 mb-2">工作日平均效率</h3>
          <p className="text-3xl font-bold text-blue-600">
            {comparison.workday.avg_efficiency.toFixed(1)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm text-gray-600 mb-2">周末平均效率</h3>
          <p className="text-3xl font-bold text-green-600">
            {comparison.weekend.avg_efficiency.toFixed(1)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm text-gray-600 mb-2">效率差异</h3>
          <p className={`text-3xl font-bold ${comparison.diff.avg_diff > 0 ? 'text-blue-600' : 'text-green-600'}`}>
            {comparison.diff.avg_diff > 0 ? '+' : ''}{comparison.diff.avg_diff.toFixed(1)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {comparison.diff.avg_diff > 0 ? '工作日更高' : '周末更高'}
          </p>
        </div>
      </div>

      {/* Interpretation */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
        <p className="text-blue-900">{comparison.diff.interpretation}</p>
      </div>

      {/* Line Chart - Comparison */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">24小时效率对比</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={prepareLineChartData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="workday"
              stroke="#3b82f6"
              strokeWidth={2}
              name="工作日"
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="weekend"
              stroke="#10b981"
              strokeWidth={2}
              name="周末"
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart - Difference */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">逐时差异分析</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={prepareDiffChartData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="diff"
              fill="#3b82f6"
              name="效率差异 (工作日 - 周末)"
            />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-sm text-gray-500 mt-4 text-center">
          正值表示工作日效率更高，负值表示周末效率更高
        </p>
      </div>

      {/* Peak Hour Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">工作日峰值</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">峰值时段</span>
              <span className="font-semibold">
                {comparison.workday.peak_start_hour}:00 - {comparison.workday.peak_end_hour}:00
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">峰值效率</span>
              <span className="font-semibold text-blue-600">
                {comparison.workday.peak_score.toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">生物钟类型</span>
              <span className="font-semibold">
                {comparison.workday.chronotype === 'morning' ? '早晨型' :
                 comparison.workday.chronotype === 'evening' ? '夜猫子型' : '中间型'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">周末峰值</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">峰值时段</span>
              <span className="font-semibold">
                {comparison.weekend.peak_start_hour}:00 - {comparison.weekend.peak_end_hour}:00
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">峰值效率</span>
              <span className="font-semibold text-green-600">
                {comparison.weekend.peak_score.toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">生物钟类型</span>
              <span className="font-semibold">
                {comparison.weekend.chronotype === 'morning' ? '早晨型' :
                 comparison.weekend.chronotype === 'evening' ? '夜猫子型' : '中间型'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

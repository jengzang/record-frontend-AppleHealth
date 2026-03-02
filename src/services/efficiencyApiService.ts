// Efficiency Curve API Service
// 个人效率曲线API服务

import axios from 'axios';
import type {
  EfficiencyCurveResponse,
  EfficiencyCurveProfile,
  ProfileComparisonResponse,
  EfficiencyInsight,
  AnalyzeRequest,
  AnalyzeResponse,
} from '../types/efficiency';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:18080';
const EFFICIENCY_BASE = `${API_BASE_URL}/api/v1/cross-module/efficiency-curve`;

export const efficiencyApiService = {
  /**
   * Get hourly efficiency curve
   * 获取小时效率曲线
   */
  async getHourlyCurve(startDate: string, endDate: string): Promise<EfficiencyCurveResponse> {
    const response = await axios.get<EfficiencyCurveResponse>(`${EFFICIENCY_BASE}/hourly`, {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  },

  /**
   * Get efficiency profile (workday or weekend)
   * 获取效率曲线画像
   */
  async getProfile(profileType: 'workday' | 'weekend'): Promise<EfficiencyCurveProfile> {
    const response = await axios.get<EfficiencyCurveProfile>(`${EFFICIENCY_BASE}/profile`, {
      params: { profile_type: profileType },
    });
    return response.data;
  },

  /**
   * Get workday vs weekend comparison
   * 获取工作日vs周末对比
   */
  async getComparison(): Promise<ProfileComparisonResponse> {
    const response = await axios.get<ProfileComparisonResponse>(`${EFFICIENCY_BASE}/comparison`);
    return response.data;
  },

  /**
   * Get efficiency insights
   * 获取效率洞察
   */
  async getInsights(): Promise<EfficiencyInsight[]> {
    const response = await axios.get<EfficiencyInsight[]>(`${EFFICIENCY_BASE}/insights`);
    return response.data;
  },

  /**
   * Trigger efficiency analysis
   * 触发效率分析
   */
  async analyzeEfficiency(request: AnalyzeRequest): Promise<AnalyzeResponse> {
    const response = await axios.post<AnalyzeResponse>(`${EFFICIENCY_BASE}/analyze`, null, {
      params: request,
    });
    return response.data;
  },
};

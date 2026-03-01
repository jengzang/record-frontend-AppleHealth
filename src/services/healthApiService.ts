import axios from 'axios';
import type {
  HealthSummary,
  HealthStatistics,
  HeartRateZones,
  Anomaly,
  RestingHR,
  DailyPattern,
  WeeklyPattern,
  HealthScore,
} from '../types/health';

const API_BASE_URL = 'http://localhost:9000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export const healthApiService = {
  // Basic queries
  async getSummary(): Promise<HealthSummary> {
    const response = await api.get('/health/summary');
    return response.data;
  },

  async getDailyStatistics(
    metric: string,
    startDate?: string,
    endDate?: string,
    limit?: number
  ): Promise<{ statistics: HealthStatistics[]; count: number }> {
    const params: Record<string, string | number> = { metric };
    if (startDate) params.start = startDate;
    if (endDate) params.end = endDate;
    if (limit) params.limit = limit;

    const response = await api.get('/health/statistics/daily', { params });
    return response.data;
  },

  // Heart rate analysis
  async getHeartRateZones(startDate?: string, endDate?: string): Promise<HeartRateZones> {
    const params: Record<string, string> = {};
    if (startDate) params.start = startDate;
    if (endDate) params.end = endDate;

    const response = await api.get('/health/analysis/heartrate/zones', { params });
    return response.data;
  },

  async getHeartRateAnomalies(
    startDate?: string,
    endDate?: string
  ): Promise<{ anomalies: Anomaly[]; count: number }> {
    const params: Record<string, string> = {};
    if (startDate) params.start = startDate;
    if (endDate) params.end = endDate;

    const response = await api.get('/health/analysis/heartrate/anomalies', { params });
    return response.data;
  },

  async getRestingHeartRate(
    startDate?: string,
    endDate?: string
  ): Promise<{ data: RestingHR[]; count: number }> {
    const params: Record<string, string> = {};
    if (startDate) params.start = startDate;
    if (endDate) params.end = endDate;

    const response = await api.get('/health/analysis/heartrate/resting', { params });
    return response.data;
  },

  // Activity patterns
  async getDailyActivityPattern(): Promise<DailyPattern> {
    const response = await api.get('/health/analysis/patterns/daily');
    return response.data;
  },

  async getWeeklyActivityPattern(): Promise<WeeklyPattern> {
    const response = await api.get('/health/analysis/patterns/weekly');
    return response.data;
  },

  // Health score
  async getHealthScore(date?: string): Promise<HealthScore> {
    const params: Record<string, string> = {};
    if (date) params.date = date;

    const response = await api.get('/health/analysis/health-score', { params });
    return response.data;
  },
};

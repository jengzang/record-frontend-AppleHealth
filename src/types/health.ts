// Health data types

export interface HealthSummary {
  totalRecords: number;
  totalWorkouts: number;
  totalSleepRecords: number;
  dateRangeStart: string;
  dateRangeEnd: string;
  lastImportDate: string;
  availableMetrics: string[];
}

export interface HealthStatistics {
  id: number;
  statType: string;
  statDate: string;
  metricType: string;
  totalValue: number;
  avgValue: number;
  minValue: number;
  maxValue: number;
  count: number;
  data?: string;
  createdAt: string;
  updatedAt: string;
}

// Heart Rate Analysis Types

export interface HeartRateZone {
  name: string;
  minBpm: number;
  maxBpm: number;
  count: number;
  percentage: number;
  totalTime: number;
}

export interface HeartRateZones {
  startDate: string;
  endDate: string;
  zones: HeartRateZone[];
  totalReadings: number;
}

export interface Anomaly {
  id: number;
  timestamp: string;
  value: number;
  reason: string;
  severity: 'low' | 'medium' | 'high';
}

export interface RestingHR {
  date: string;
  restingBpm: number;
  minBpm: number;
  avgBpm: number;
}

export interface HRVMetrics {
  startDate: string;
  endDate: string;
  avgHrv: number;
  stdDev: number;
  rmssd: number;
  consistency: number;
}

// Activity Pattern Types

export interface HourlyPattern {
  hour: number;
  avgHeartRate: number;
  count: number;
  percentage: number;
}

export interface DailyPattern {
  hours: HourlyPattern[];
  peakHour: number;
  quietestHour: number;
  totalReadings: number;
}

export interface WeekdayPattern {
  weekday: string;
  avgHeartRate: number;
  count: number;
  percentage: number;
}

export interface WeeklyPattern {
  days: WeekdayPattern[];
  mostActiveDay: string;
  leastActiveDay: string;
  totalReadings: number;
}

// Health Score Types

export interface HealthScore {
  date: string;
  overallScore: number;
  restingHrScore: number;
  variabilityScore: number;
  consistencyScore: number;
  restingHr: number;
  avgHr: number;
  measurementCount: number;
  grade: string;
}

export interface HealthScorePoint {
  date: string;
  score: number;
  grade: string;
}


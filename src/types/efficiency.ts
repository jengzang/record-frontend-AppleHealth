// Efficiency Curve Types
// 个人效率曲线相关类型定义

export interface HourlyEfficiencyScore {
  id: number;
  date: string; // YYYY-MM-DD
  hour: number; // 0-23

  // Keyboard metrics
  typing_speed?: number;
  typing_speed_normalized?: number;

  // ScreenTime metrics
  work_app_ratio?: number;
  entertainment_app_ratio?: number;
  focus_session_count?: number;
  app_switch_frequency?: number;
  work_app_ratio_normalized?: number;
  focus_normalized?: number;

  // Health metrics
  avg_heart_rate?: number;
  heart_rate_variability?: number;
  step_count?: number;
  hrv_normalized?: number;
  activity_normalized?: number;

  // Composite score
  efficiency_score: number;

  // Data quality
  has_keyboard_data: boolean;
  has_screentime_data: boolean;
  has_health_data: boolean;
  data_completeness: number;

  created_at: string;
  updated_at: string;
}

export interface EfficiencyCurveProfile {
  id: number;
  profile_type: 'workday' | 'weekend';

  // 24-hour curve
  hourly_curve: number[]; // 24 elements

  // Peak analysis
  peak_hour: number;
  peak_score: number;
  peak_start_hour: number;
  peak_end_hour: number;

  // Low analysis
  low_hour: number;
  low_score: number;

  // Chronotype
  chronotype: 'morning' | 'evening' | 'intermediate';
  chronotype_confidence: number;

  // Statistics
  avg_efficiency: number;
  std_efficiency: number;
  total_samples: number;

  // Date range
  start_date: string;
  end_date: string;

  created_at: string;
  updated_at: string;
}

export interface EfficiencyInsight {
  id: number;
  insight_type: string;
  priority: number; // 0=low, 1=medium, 2=high
  title: string;
  description: string;
  recommendation?: string;
  data?: string; // JSON
  confidence: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EfficiencyCurveResponse {
  scores: HourlyEfficiencyScore[];
  stats: {
    total_hours: number;
    avg_efficiency: number;
    max_efficiency: number;
    min_efficiency: number;
    data_completeness: number;
  };
}

export interface ProfileComparisonResponse {
  workday: EfficiencyCurveProfile;
  weekend: EfficiencyCurveProfile;
  diff: {
    avg_diff: number;
    peak_hour_diff: number;
    hourly_diff: number[]; // 24 elements
    interpretation: string;
  };
}

export interface AnalyzeRequest {
  start_date: string;
  end_date: string;
}

export interface AnalyzeResponse {
  message: string;
  start_date: string;
  end_date: string;
}

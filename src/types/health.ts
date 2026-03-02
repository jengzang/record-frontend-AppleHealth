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

// Weight and BMI Analysis Types

export interface WeightDataPoint {
  date: string;
  weight: number;
  bmi: number;
}

export interface WeightPrediction {
  predictedWeight: number;
  predictedBMI: number;
  targetDate: string;
  confidence: number;
  trend: string;
}

export interface WeightBMIAnalysis {
  currentWeight: number;
  currentBMI: number;
  bmiCategory: string;
  healthStatus: string;
  weightTrend: WeightDataPoint[];
  prediction: WeightPrediction;
  recommendations: string[];
  statistics: {
    minWeight: number;
    maxWeight: number;
    avgWeight: number;
    weightChange: number;
    changePercentage: number;
    dataPoints: number;
  };
}

// Exercise Analysis Types

export interface ExerciseAnalysis {
  summary: ExerciseSummary;
  dailyStats: DailyExerciseStats[];
  workoutTypes: WorkoutTypeStats[];
  calorieTrend: CalorieDataPoint[];
  intensityAnalysis: IntensityAnalysis;
  achievements: Achievement[];
  recommendations: string[];
}

export interface ExerciseSummary {
  totalSteps: number;
  totalDistance: number;
  totalCalories: number;
  totalWorkouts: number;
  avgDailySteps: number;
  avgDailyDistance: number;
  avgDailyCalories: number;
  activeDays: number;
  mostActiveDay: string;
  longestWorkout: number;
  totalExerciseTime: number;
}

export interface DailyExerciseStats {
  date: string;
  steps: number;
  distance: number;
  calories: number;
  flightsClimbed: number;
  exerciseMinutes: number;
  workoutCount: number;
}

export interface WorkoutTypeStats {
  workoutType: string;
  count: number;
  totalDuration: number;
  totalDistance: number;
  totalCalories: number;
  avgDuration: number;
  avgDistance: number;
  avgCalories: number;
  percentage: number;
}

export interface CalorieDataPoint {
  date: string;
  activeCalories: number;
  restingCalories: number;
  totalCalories: number;
}

export interface IntensityAnalysis {
  lowIntensity: IntensityStats;
  moderateIntensity: IntensityStats;
  highIntensity: IntensityStats;
  avgMETs: number;
  intensityScore: number;
}

export interface IntensityStats {
  minutes: number;
  percentage: number;
  calories: number;
}

export interface Achievement {
  title: string;
  description: string;
  value: number;
  unit: string;
  date: string;
  type: string;
}

// Sleep Analysis Types

export interface SleepAnalysis {
  summary: SleepSummary;
  dailySleep: DailySleepStats[];
  sleepStages: SleepStageDistribution;
  sleepPattern: SleepPattern;
  qualityScore: SleepQualityScore;
  heartRateCorrelation: HeartRateCorrelation;
  recommendations: string[];
}

export interface SleepSummary {
  totalSleepDays: number;
  avgSleepDuration: number;
  avgDeepSleep: number;
  avgLightSleep: number;
  avgREMSleep: number;
  avgBedTime: string;
  avgWakeTime: string;
  sleepEfficiency: number;
  bestSleepDate: string;
  worstSleepDate: string;
}

export interface DailySleepStats {
  date: string;
  totalSleep: number;
  deepSleep: number;
  lightSleep: number;
  remSleep: number;
  awakeTime: number;
  bedTime: string;
  wakeTime: string;
  sleepQuality: number;
  heartRateAvg: number;
}

export interface SleepStageDistribution {
  deepSleepPercent: number;
  lightSleepPercent: number;
  remSleepPercent: number;
  awakePercent: number;
  totalMinutes: number;
}

export interface SleepPattern {
  bedTimeConsistency: number;
  wakeTimeConsistency: number;
  weekdayAvgSleep: number;
  weekendAvgSleep: number;
  sleepDebt: number;
  optimalBedTime: string;
  optimalWakeTime: string;
}

export interface SleepQualityScore {
  overallScore: number;
  durationScore: number;
  efficiencyScore: number;
  consistencyScore: number;
  deepSleepScore: number;
  grade: string;
}

export interface HeartRateCorrelation {
  avgSleepingHR: number;
  avgWakingHR: number;
  hrDrop: number;
  hrDropPercent: number;
  correlation: number;
  insight: string;
}

// Health-Screentime Correlation Types

export interface HealthScreentimeCorrelation {
  balanceScore: number;
  sedentaryAnalysis: SedentaryAnalysis;
  activityCorrelation: ActivityCorrelation;
  sleepImpact: SleepImpact;
  recommendations: string[];
}

export interface SedentaryAnalysis {
  sedentaryDays: number;
  totalDays: number;
  sedentaryRate: number;
  avgScreenTimeOnSedentaryDays: number;
  avgStepsOnSedentaryDays: number;
  highRiskDays: number;
  mediumRiskDays: number;
  lowRiskDays: number;
  sedentaryDayDetails: SedentaryDayDetail[];
}

export interface SedentaryDayDetail {
  date: string;
  screenTime: number;
  steps: number;
  riskLevel: string;
}

export interface ActivityCorrelation {
  correlationCoefficient: number;
  correlationType: string;
  avgSteps: number;
  avgScreenTime: number;
  dataPoints: ActivityDataPoint[];
}

export interface ActivityDataPoint {
  date: string;
  steps: number;
  screenTime: number;
}

export interface SleepImpact {
  avgSleepWithLateScreenTime: number;
  avgSleepWithoutLateScreenTime: number;
  sleepDifference: number;
  lateScreenTimeDays: number;
  normalDays: number;
  impactLevel: string;
}

// Health Rankings Types

export interface RankingEntry {
  rank: number;
  date: string;
  value: number;
  unit: string;
  description: string;
  isCurrent: boolean;
}

export interface PersonalBests {
  maxSteps: RankingEntry;
  maxDistance: RankingEntry;
  maxCalories: RankingEntry;
  lowestRestingHR: RankingEntry;
  longestSleep: RankingEntry;
  longestWorkout: RankingEntry;
  mostWorkoutsDay: RankingEntry;
}

export interface RankingSummary {
  totalDaysTracked: number;
  top10DaysPercent: number;
  currentStreak: number;
  longestStreak: number;
  averageRank: number;
  improvement: string;
}

export interface HealthRankings {
  stepsRankings: RankingEntry[];
  distanceRankings: RankingEntry[];
  caloriesRankings: RankingEntry[];
  heartRateRankings: RankingEntry[];
  sleepRankings: RankingEntry[];
  workoutRankings: RankingEntry[];
  personalBests: PersonalBests;
  summary: RankingSummary;
}


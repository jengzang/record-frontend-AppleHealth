/**
 * Health metric type mappings
 * Maps user-friendly names to Apple Health identifier names
 */

export const METRIC_TYPES = {
  // Heart Rate
  HEART_RATE: 'HKQuantityTypeIdentifierHeartRate',

  // Body Measurements
  BODY_MASS: 'HKQuantityTypeIdentifierBodyMass',
  HEIGHT: 'HKQuantityTypeIdentifierHeight',
  BODY_MASS_INDEX: 'HKQuantityTypeIdentifierBodyMassIndex',

  // Activity
  STEP_COUNT: 'HKQuantityTypeIdentifierStepCount',
  DISTANCE_WALKING_RUNNING: 'HKQuantityTypeIdentifierDistanceWalkingRunning',
  ACTIVE_ENERGY_BURNED: 'HKQuantityTypeIdentifierActiveEnergyBurned',
  BASAL_ENERGY_BURNED: 'HKQuantityTypeIdentifierBasalEnergyBurned',
  FLIGHTS_CLIMBED: 'HKQuantityTypeIdentifierFlightsClimbed',
} as const;

export type MetricType = typeof METRIC_TYPES[keyof typeof METRIC_TYPES];

/**
 * Get display name for a metric type
 */
export const getMetricDisplayName = (metricType: string): string => {
  const displayNames: Record<string, string> = {
    [METRIC_TYPES.HEART_RATE]: '心率',
    [METRIC_TYPES.BODY_MASS]: '体重',
    [METRIC_TYPES.HEIGHT]: '身高',
    [METRIC_TYPES.BODY_MASS_INDEX]: 'BMI',
    [METRIC_TYPES.STEP_COUNT]: '步数',
    [METRIC_TYPES.DISTANCE_WALKING_RUNNING]: '步行/跑步距离',
    [METRIC_TYPES.ACTIVE_ENERGY_BURNED]: '活动能量',
    [METRIC_TYPES.BASAL_ENERGY_BURNED]: '基础能量',
    [METRIC_TYPES.FLIGHTS_CLIMBED]: '爬楼层数',
  };

  return displayNames[metricType] || metricType;
};

/**
 * Get unit for a metric type
 */
export const getMetricUnit = (metricType: string): string => {
  const units: Record<string, string> = {
    [METRIC_TYPES.HEART_RATE]: 'BPM',
    [METRIC_TYPES.BODY_MASS]: 'kg',
    [METRIC_TYPES.HEIGHT]: 'cm',
    [METRIC_TYPES.BODY_MASS_INDEX]: '',
    [METRIC_TYPES.STEP_COUNT]: '步',
    [METRIC_TYPES.DISTANCE_WALKING_RUNNING]: 'km',
    [METRIC_TYPES.ACTIVE_ENERGY_BURNED]: 'kcal',
    [METRIC_TYPES.BASAL_ENERGY_BURNED]: 'kcal',
    [METRIC_TYPES.FLIGHTS_CLIMBED]: '层',
  };

  return units[metricType] || '';
};

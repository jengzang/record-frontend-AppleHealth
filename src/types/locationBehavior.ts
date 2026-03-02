// Location Behavior Analysis Types

export interface Location {
  id: number;
  geohash: string;
  centerLat: number;
  centerLon: number;
  radius: number;
  visitCount: number;
  totalDuration: number;
  firstVisit: string;
  lastVisit: string;
  label: string;
  labelConfidence: number;
  createdAt: string;
  updatedAt: string;
}

export interface LocationBehavior {
  id: number;
  locationId: number;
  visitDate: string;
  visitStart: string;
  visitEnd: string;
  duration: number;
  typingSpeed: number;
  workAppRatio: number;
  entertainmentRatio: number;
  focusDuration: number;
  appSwitchCount: number;
  avgHeartRate: number;
  heartRateVariability: number;
  steps: number;
  createdAt: string;
}

export interface LocationEfficiencyScore {
  id: number;
  locationId: number;
  productivityScore: number;
  healthScore: number;
  focusScore: number;
  efficiencyScore: number;
  visitCount: number;
  avgDuration: number;
  calculatedAt: string;
}

export interface LocationHabit {
  id: number;
  locationId: number;
  habitType: string;
  habitDescription: string;
  confidence: number;
  occurrenceCount: number;
  detectedAt: string;
}

export interface LocationWithEfficiency {
  id: number;
  geohash: string;
  centerLat: number;
  centerLon: number;
  radius: number;
  visitCount: number;
  totalDuration: number;
  firstVisit: string;
  lastVisit: string;
  label: string;
  labelConfidence: number;
  createdAt: string;
  updatedAt: string;
  efficiencyScore: LocationEfficiencyScore;
  habits: LocationHabit[];
}

export interface HeatmapPoint {
  lat: number;
  lon: number;
  efficiency: number;
  visitCount: number;
  label: string;
  labelConfidence: number;
}

export interface HabitWithLocation {
  locationId: number;
  locationLabel: string;
  habitType: string;
  habitDescription: string;
  confidence: number;
  occurrenceCount: number;
}

export interface LocationRankings {
  topEfficient: LocationWithEfficiency[];
  leastEfficient: LocationWithEfficiency[];
}

export type LocationLabel = 'HOME' | 'OFFICE' | 'CAFE' | 'GYM' | 'TRANSIT' | 'LEISURE' | 'OTHER' | 'UNKNOWN';

export const LOCATION_LABEL_COLORS: Record<LocationLabel, string> = {
  HOME: '#1890ff',
  OFFICE: '#52c41a',
  CAFE: '#faad14',
  GYM: '#f5222d',
  TRANSIT: '#722ed1',
  LEISURE: '#eb2f96',
  OTHER: '#8c8c8c',
  UNKNOWN: '#d9d9d9',
};

export const LOCATION_LABEL_NAMES: Record<LocationLabel, string> = {
  HOME: '家',
  OFFICE: '办公室',
  CAFE: '咖啡馆',
  GYM: '健身房',
  TRANSIT: '交通',
  LEISURE: '休闲',
  OTHER: '其他',
  UNKNOWN: '未知',
};

import axios from 'axios';
import type {
  LocationWithEfficiency,
  LocationRankings,
  HeatmapPoint,
  HabitWithLocation,
} from '../types/locationBehavior';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

export const locationBehaviorApi = {
  // Get all locations with efficiency data
  getLocations: async (): Promise<LocationWithEfficiency[]> => {
    const response = await axios.get(`${API_BASE_URL}/cross-module/location-behavior/locations`);
    return response.data.data;
  },

  // Get location by ID with full details
  getLocationById: async (id: number): Promise<LocationWithEfficiency> => {
    const response = await axios.get(`${API_BASE_URL}/cross-module/location-behavior/locations/${id}`);
    return response.data;
  },

  // Get efficiency rankings (top and least efficient)
  getRankings: async (limit: number = 10): Promise<LocationRankings> => {
    const response = await axios.get(`${API_BASE_URL}/cross-module/location-behavior/rankings`, {
      params: { limit },
    });
    return response.data;
  },

  // Get heatmap data for map visualization
  getHeatmapData: async (): Promise<HeatmapPoint[]> => {
    const response = await axios.get(`${API_BASE_URL}/cross-module/location-behavior/heatmap`);
    return response.data.data;
  },

  // Get all habits across all locations
  getHabits: async (): Promise<HabitWithLocation[]> => {
    const response = await axios.get(`${API_BASE_URL}/cross-module/location-behavior/habits`);
    return response.data.data;
  },

  // Trigger location analysis
  analyzeLocations: async (): Promise<void> => {
    await axios.post(`${API_BASE_URL}/cross-module/location-behavior/analyze`);
  },

  // Update location label
  updateLocationLabel: async (id: number, label: string, confidence: number): Promise<void> => {
    await axios.patch(`${API_BASE_URL}/cross-module/location-behavior/locations/${id}`, {
      label,
      labelConfidence: confidence,
    });
  },
};

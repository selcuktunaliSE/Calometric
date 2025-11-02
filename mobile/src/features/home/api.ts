// src/features/home/api.ts
import { api } from '../../api';
import { DaySummary, WeekSummaryPoint, FoodLogItem, ProfileDTO } from '../../types/api';

export const getTodaySummary = async (): Promise<DaySummary> => {
  const { data } = await api.get('/summary/today');
  return data;
};

export const getTodayLogs = async (): Promise<FoodLogItem[]> => {
  const { data } = await api.get('/logs/today');
  return data;
};

export const getWeekSummary = async (): Promise<WeekSummaryPoint[]> => {
  const { data } = await api.get('/summary/week');
  return data;
};

export const getProfile = async (): Promise<ProfileDTO> => {
  const { data } = await api.get('/me/profile'); // backend kısmını aşağıda verdim
  return data;
};

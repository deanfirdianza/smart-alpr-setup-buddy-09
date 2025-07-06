import api from '@/lib/axios';

export interface HistoryRecord {
  id: number;
  plate_number: string;
  timestamp: string; // backend returns ISO string
  confidence: number;
}

export interface HistoryResponse {
  items: HistoryRecord[];
  total: number;
}

export const getScanHistory = async (params: {
  plate?: string;
  date_from?: string;
  date_to?: string;
  page: number;
  per_page: number;
}) => {
  const res = await api.get('/history', { params });
  return res.data as HistoryResponse;
};

export const getScanHistoryFromDashboard = async (params = {}) => {
  const response = await api.get<{ items: HistoryRecord[]; total: number }>('/history', { params });
  return response.data;
};

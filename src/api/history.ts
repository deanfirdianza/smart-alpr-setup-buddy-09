import api from '@/lib/axios';
import axios from 'axios';

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

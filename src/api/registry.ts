// src/api/registry.ts
import api from '@/lib/axios';

export interface PlateRecord {
  id: number;
  plate_number: string;
  registered_owner?: string;
  tax_status: 'Lunas' | 'Belum Lunas' | 'Tidak Teridentifikasi';
  last_checked: string;
}

export interface RegistryResponse {
  items: PlateRecord[];
  total: number;
}

export const fetchPlates = async (
  search: string,
  taxStatus: string,
  page: number,
  perPage: number
): Promise<RegistryResponse> => {
  const res = await api.get('/plates', {
    params: {
      search: search || undefined,
      tax_status: taxStatus || undefined,
      page,
      per_page: perPage,
    },
  });
  return res.data as RegistryResponse;
};

import api from '@/lib/axios';

export const scanOnceImage = async () => {
  const res = await api.get('/scan_by_image');
  return res.data;
};

export const getAutoOCRStatus = async (): Promise<boolean> => {
  const res = await api.get('/auto_ocr');
  return res.data.enabled;
};

export const setAutoOCRStatus = async (enabled: boolean) => {
  await api.post('/auto_ocr', { enabled });
};

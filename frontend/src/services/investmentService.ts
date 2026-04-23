import api from '@/lib/api';
import { AssetCreate, AssetResponse } from '@/types/investment';

export const investmentService = {
  async getAssets(): Promise<AssetResponse[]> {
    const response = await api.get('/assets');
    return response.data;
  },

  async createAsset(data: AssetCreate): Promise<AssetResponse> {
    const response = await api.post('/assets', data);
    return response.data;
  },

  async deleteAsset(id: number): Promise<void> {
    await api.delete(`/assets/${id}`);
  },
};

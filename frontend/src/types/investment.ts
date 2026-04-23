export interface AssetBase {
  symbol: string;
  name: string;
  type: 'stock' | 'crypto';
  quantity: number;
  average_price: number;
}

export interface AssetCreate extends AssetBase {}

export interface AssetResponse extends AssetBase {
  id: number;
  current_price?: number;
  total_value?: number;
  gain_loss?: number;
  gain_loss_percent?: number;
}

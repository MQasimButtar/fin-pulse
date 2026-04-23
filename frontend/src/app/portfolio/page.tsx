'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { investmentService } from '@/services/investmentService';
import { AssetResponse, AssetCreate } from '@/types/investment';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  BarChart3,
  Coins,
  Search,
  ArrowUpRight,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PortfolioPage() {
  const [assets, setAssets] = useState<AssetResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form State
  const [newAsset, setNewAsset] = useState<AssetCreate>({
    symbol: '',
    name: '',
    type: 'stock',
    quantity: 0,
    average_price: 0
  });

  const fetchAssets = async () => {
    try {
      const data = await investmentService.getAssets();
      setAssets(data);
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await investmentService.createAsset(newAsset);
      setShowAddForm(false);
      setNewAsset({ symbol: '', name: '', type: 'stock', quantity: 0, average_price: 0 });
      fetchAssets();
    } catch (error) {
      console.error('Error adding asset:', error);
    }
  };

  const handleDeleteAsset = async (id: number) => {
    if (!confirm('Are you sure you want to delete this asset?')) return;
    try {
      await investmentService.deleteAsset(id);
      fetchAssets();
    } catch (error) {
      console.error('Error deleting asset:', error);
    }
  };

  const totalValue = assets.reduce((acc, a) => acc + (a.total_value || 0), 0);
  const totalGainLoss = assets.reduce((acc, a) => acc + (a.gain_loss || 0), 0);
  const totalGainLossPct = totalValue > 0 ? (totalGainLoss / (totalValue - totalGainLoss) * 100) : 0;

  const stocks = assets.filter(a => a.type === 'stock');
  const cryptos = assets.filter(a => a.type === 'crypto');

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-zinc-950">Investment Portfolio</h1>
            <p className="text-zinc-500 mt-1">Real-time performance of your market holdings.</p>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="btn-primary"
          >
            <Plus size={18} />
            Add Asset
          </button>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6 border-zinc-100">
            <p className="text-zinc-500 text-sm font-medium mb-1">Total Balance</p>
            <p className="text-3xl font-bold text-zinc-950">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div className="card p-6 border-zinc-100">
            <p className="text-zinc-500 text-sm font-medium mb-1">Unrealized Gain/Loss</p>
            <div className="flex items-center gap-2">
              <p className={cn(
                "text-2xl font-bold",
                totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'
              )}>
                {totalGainLoss >= 0 ? '+' : '-'}${Math.abs(totalGainLoss).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <span className={cn(
                "text-xs font-bold px-1.5 py-0.5 rounded",
                totalGainLoss >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              )}>
                {totalGainLossPct.toFixed(2)}%
              </span>
            </div>
          </div>
          <div className="card p-6 border-zinc-100">
            <p className="text-zinc-500 text-sm font-medium mb-1">Holdings Count</p>
            <p className="text-3xl font-bold text-zinc-950">{assets.length} Assets</p>
          </div>
        </div>

        {showAddForm && (
          <div className="fixed inset-0 bg-zinc-950/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-border animate-in fade-in zoom-in duration-200">
              <h2 className="text-2xl font-bold mb-6">Add New Asset</h2>
              <form onSubmit={handleAddAsset} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Asset Type</label>
                  <select 
                    className="input-field bg-zinc-50"
                    value={newAsset.type}
                    onChange={e => setNewAsset({...newAsset, type: e.target.value as 'stock' | 'crypto'})}
                  >
                    <option value="stock">Stock</option>
                    <option value="crypto">Cryptocurrency</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Symbol</label>
                    <input 
                      type="text"
                      placeholder="e.g. AAPL"
                      required
                      className="input-field"
                      value={newAsset.symbol}
                      onChange={e => setNewAsset({...newAsset, symbol: e.target.value.toUpperCase()})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Name</label>
                    <input 
                      type="text"
                      placeholder="Apple Inc."
                      required
                      className="input-field"
                      value={newAsset.name}
                      onChange={e => setNewAsset({...newAsset, name: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Quantity</label>
                    <input 
                      type="number"
                      step="any"
                      required
                      className="input-field"
                      value={newAsset.quantity || ''}
                      onChange={e => {
                        const val = parseFloat(e.target.value);
                        setNewAsset({...newAsset, quantity: isNaN(val) ? 0 : val});
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Avg Buy Price</label>
                    <input 
                      type="number"
                      step="any"
                      required
                      className="input-field"
                      value={newAsset.average_price || ''}
                      onChange={e => {
                        const val = parseFloat(e.target.value);
                        setNewAsset({...newAsset, average_price: isNaN(val) ? 0 : val});
                      }}
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 px-4 py-2 border border-border rounded-lg font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 btn-primary justify-center"
                  >
                    Add Asset
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="text-zinc-400" size={20} />
              <h2 className="text-xl font-bold text-zinc-950">Stocks</h2>
            </div>
            <div className="card border-zinc-100 overflow-hidden">
              <table className="min-w-full divide-y divide-zinc-100">
                <thead className="bg-zinc-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Asset</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-zinc-500 uppercase tracking-wider">Holdings</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-zinc-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-zinc-500 uppercase tracking-wider">Market Value</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-zinc-500 uppercase tracking-wider">G/L</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {stocks.map(asset => (
                    <tr key={asset.id} className="hover:bg-zinc-50/30 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-bold text-zinc-900">{asset.symbol}</span>
                          <span className="text-xs text-zinc-400 font-medium">{asset.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex flex-col">
                          <span className="text-zinc-900 font-medium">{asset.quantity} shares</span>
                          <span className="text-xs text-zinc-400">Avg: ${asset.average_price.toFixed(2)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-zinc-900 font-medium">
                        ${asset.current_price?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-zinc-900">
                        ${asset.total_value?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex flex-col items-end">
                          <span className={cn(
                            "font-bold",
                            asset.gain_loss! >= 0 ? 'text-green-600' : 'text-red-600'
                          )}>
                            {asset.gain_loss! >= 0 ? '+' : '-'}${Math.abs(asset.gain_loss!).toFixed(2)}
                          </span>
                          <span className={cn(
                            "text-xs font-medium",
                            asset.gain_loss! >= 0 ? 'text-green-500' : 'text-red-500'
                          )}>
                            {asset.gain_loss_percent?.toFixed(2)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDeleteAsset(asset.id)}
                          className="p-2 text-zinc-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {stocks.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-zinc-400">No stock holdings in your portfolio.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Coins className="text-zinc-400" size={20} />
              <h2 className="text-xl font-bold text-zinc-950">Cryptocurrencies</h2>
            </div>
            <div className="card border-zinc-100 overflow-hidden">
              <table className="min-w-full divide-y divide-zinc-100">
                <thead className="bg-zinc-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Asset</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-zinc-500 uppercase tracking-wider">Holdings</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-zinc-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-zinc-500 uppercase tracking-wider">Market Value</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-zinc-500 uppercase tracking-wider">G/L</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {cryptos.map(asset => (
                    <tr key={asset.id} className="hover:bg-zinc-50/30 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-bold text-zinc-900">{asset.symbol}</span>
                          <span className="text-xs text-zinc-400 font-medium">{asset.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex flex-col">
                          <span className="text-zinc-900 font-medium">{asset.quantity}</span>
                          <span className="text-xs text-zinc-400">Avg: ${asset.average_price.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-zinc-900 font-medium">
                        ${asset.current_price?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-zinc-900">
                        ${asset.total_value?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex flex-col items-end">
                          <span className={cn(
                            "font-bold",
                            asset.gain_loss! >= 0 ? 'text-green-600' : 'text-red-600'
                          )}>
                            {asset.gain_loss! >= 0 ? '+' : '-'}${Math.abs(asset.gain_loss!).toLocaleString()}
                          </span>
                          <span className={cn(
                            "text-xs font-medium",
                            asset.gain_loss! >= 0 ? 'text-green-500' : 'text-red-500'
                          )}>
                            {asset.gain_loss_percent?.toFixed(2)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDeleteAsset(asset.id)}
                          className="p-2 text-zinc-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {cryptos.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-zinc-400">No crypto holdings in your portfolio.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { financeService } from '@/services/financeService';
import { TransactionResponse } from '@/types/finance';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight,
  Search,
  Filter,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  const fetchTransactions = async () => {
    try {
      const data = await financeService.getTransactions();
      // Sort by date descending
      const sortedData = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setTransactions(sortedData);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    try {
      await financeService.deleteTransaction(id);
      fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || tx.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-950">Transactions</h1>
            <p className="text-zinc-500 mt-1">Track every dollar and manage your spending habits.</p>
          </div>
          <Link href="/transactions/new" className="btn-primary flex items-center gap-2 self-start md:self-auto">
            <Plus size={18} />
            Add Transaction
          </Link>
        </div>

        {/* Filters/Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              placeholder="Search descriptions or categories..." 
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-950/5 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <select 
                className="pl-9 pr-8 py-2 rounded-xl border border-zinc-200 text-zinc-600 bg-white hover:bg-zinc-50 transition-colors appearance-none focus:outline-none focus:ring-2 focus:ring-zinc-950/5"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
              >
                <option value="all">All Types</option>
                <option value="income">Income Only</option>
                <option value="expense">Expense Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transactions Table/List */}
        <div className="card border-zinc-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-zinc-500">Loading transactions...</div>
          ) : filteredTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50/50 border-b border-zinc-100">
                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Amount</th>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-zinc-50/30 transition-colors group">
                      <td className="px-6 py-4 text-sm text-zinc-500 whitespace-nowrap">
                        {new Date(tx.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-2 rounded-lg",
                            tx.type === 'income' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                          )}>
                            {tx.type === 'income' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                          </div>
                          <span className="font-semibold text-zinc-900">{tx.description}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600 text-xs font-medium uppercase">
                          {tx.category}
                        </span>
                      </td>
                      <td className={cn(
                        "px-6 py-4 text-right font-bold text-base whitespace-nowrap",
                        tx.type === 'income' ? "text-green-600" : "text-zinc-900"
                      )}>
                        {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDelete(tx.id)}
                          className="p-2 text-zinc-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-20 text-center">
              <div className="bg-zinc-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-zinc-300" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">No transactions found</h3>
              <p className="text-zinc-500 mt-1 max-w-xs mx-auto">
                {searchTerm 
                  ? `We couldn't find anything matching "${searchTerm}"`
                  : "Start tracking your finances by adding your first transaction."}
              </p>
              {!searchTerm && (
                <Link href="/transactions/new" className="btn-primary mt-6 inline-flex items-center gap-2">
                  <Plus size={18} />
                  Add Transaction
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

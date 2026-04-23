'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { financeService } from '@/services/financeService';
import api from '@/lib/api';
import { TransactionResponse, BudgetResponse } from '@/types/finance';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet,
  TrendingUp,
  CircleDollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [budgets, setBudgets] = useState<BudgetResponse[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [txData, budgetData, assetData] = await Promise.all([
          financeService.getTransactions(),
          financeService.getBudgets(),
          api.get('/assets').then(res => res.data)
        ]);
        setTransactions(txData);
        setBudgets(budgetData);
        setAssets(assetData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const investmentValue = assets.reduce((acc, a) => acc + (a.total_value || 0), 0);
  const balance = totalIncome - totalExpenses + investmentValue;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-950">Overview</h1>
          <p className="text-zinc-500 mt-1">Manage your wealth and track your financial growth.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-zinc-950 p-6 rounded-2xl text-white shadow-xl shadow-zinc-200">
            <div className="flex justify-between items-center mb-4">
              <span className="text-zinc-400 text-sm font-medium">Net Worth</span>
              <Wallet className="text-zinc-400" size={20} />
            </div>
            <p className="text-3xl font-bold tracking-tight">${balance.toLocaleString()}</p>
          </div>

          <div className="card p-6 border-zinc-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-zinc-500 text-sm font-medium">Total Income</span>
              <ArrowUpRight className="text-green-600" size={20} />
            </div>
            <p className="text-2xl font-bold text-zinc-900">${totalIncome.toLocaleString()}</p>
          </div>

          <div className="card p-6 border-zinc-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-zinc-500 text-sm font-medium">Total Expenses</span>
              <ArrowDownRight className="text-red-600" size={20} />
            </div>
            <p className="text-2xl font-bold text-zinc-900">${totalExpenses.toLocaleString()}</p>
          </div>

          <div className="card p-6 border-zinc-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-zinc-500 text-sm font-medium">Investments</span>
              <TrendingUp className="text-indigo-600" size={20} />
            </div>
            <p className="text-2xl font-bold text-zinc-900">${investmentValue.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Transactions List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-zinc-950">Recent Transactions</h2>
              <Link href="/transactions" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                View All
              </Link>
            </div>
            <div className="card border-zinc-100 overflow-hidden">
              <div className="divide-y divide-zinc-50">
                {transactions.slice(0, 6).map(tx => (
                  <div key={tx.id} className="flex justify-between items-center p-4 hover:bg-zinc-50/50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "p-2.5 rounded-xl",
                        tx.type === 'income' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                      )}>
                        {tx.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-900">{tx.description}</p>
                        <p className="text-sm text-zinc-500">{tx.category} • {new Date(tx.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className={cn(
                      "font-bold text-lg",
                      tx.type === 'income' ? "text-green-600" : "text-zinc-900"
                    )}>
                      {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                    </p>
                  </div>
                ))}
                {transactions.length === 0 && (
                  <div className="p-12 text-center">
                    <p className="text-zinc-400">No transactions recorded yet.</p>
                    <Link href="/transactions/new" className="mt-4 btn-primary text-sm py-2">
                      <Plus size={16} />
                      Add First Transaction
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Budgets List */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-950">Active Budgets</h2>
            <div className="card p-6 border-zinc-100 space-y-6">
              {budgets.map(budget => {
                const spent = transactions
                  .filter(t => t.category === budget.category && t.type === 'expense')
                  .reduce((acc, t) => acc + t.amount, 0);
                const percent = Math.min((spent / budget.limit) * 100, 100);
                
                return (
                  <div key={budget.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-zinc-700">{budget.category}</span>
                      <span className="text-zinc-500 font-medium">
                        <span className="text-zinc-900">${spent.toLocaleString()}</span> / ${budget.limit.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-zinc-100 rounded-full h-2">
                      <div 
                        className={cn(
                          "h-2 rounded-full transition-all duration-500",
                          percent > 90 ? 'bg-red-500' : 'bg-zinc-900'
                        )}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
              {budgets.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-zinc-400 text-sm">Set budgeting goals to save more.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

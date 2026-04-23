'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { financeService } from '@/services/financeService';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  ArrowLeft, 
  Loader2, 
  DollarSign, 
  Tag, 
  FileText, 
  Calendar,
  ArrowUpCircle,
  ArrowDownCircle
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function NewTransactionPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    type: 'expense' as 'income' | 'expense'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await financeService.createTransaction({
        description: formData.description,
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
        type: formData.type
      });
      router.push('/transactions');
      router.refresh();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create transaction. Please try again.');
      setIsSubmitting(false);
    }
  };

  const categories = [
    'Food', 'Transport', 'Rent', 'Shopping', 'Entertainment', 
    'Health', 'Salary', 'Investment', 'Gift', 'Other'
  ];

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/transactions" className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-zinc-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-zinc-950">Add Transaction</h1>
            <p className="text-zinc-500">Record a new income or expense item.</p>
          </div>
        </div>

        <div className="card p-8 border-zinc-100 shadow-xl shadow-zinc-200/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type Selector */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'expense' })}
                className={cn(
                  "flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all font-semibold",
                  formData.type === 'expense' 
                    ? "border-red-500 bg-red-50 text-red-700" 
                    : "border-zinc-100 text-zinc-400 hover:border-zinc-200"
                )}
              >
                <ArrowDownCircle size={20} />
                Expense
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'income' })}
                className={cn(
                  "flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all font-semibold",
                  formData.type === 'income' 
                    ? "border-green-500 bg-green-50 text-green-700" 
                    : "border-zinc-100 text-zinc-400 hover:border-zinc-200"
                )}
              >
                <ArrowUpCircle size={20} />
                Income
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5 flex items-center gap-2">
                  <FileText size={16} className="text-zinc-400" />
                  Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monthly Rent, Grocery Store"
                  className="input-field"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1.5 flex items-center gap-2">
                    <DollarSign size={16} className="text-zinc-400" />
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    className="input-field"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1.5 flex items-center gap-2">
                    <Tag size={16} className="text-zinc-400" />
                    Category
                  </label>
                  <select
                    required
                    className="input-field appearance-none bg-white"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="" disabled>Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5 flex items-center gap-2">
                  <Calendar size={16} className="text-zinc-400" />
                  Date
                </label>
                <input
                  type="date"
                  required
                  className="input-field"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm font-medium">
                {error}
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary justify-center py-3 text-base disabled:opacity-70"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <>Save Transaction</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

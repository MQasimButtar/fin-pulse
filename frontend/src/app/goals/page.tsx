'use client';

import React, { useEffect, useState } from 'react';
import { financeService } from '@/services/financeService';
import { GoalResponse, GoalCreate } from '@/types/goals';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Plus, 
  Target, 
  Trash2, 
  Calendar,
  DollarSign,
  Tag,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function GoalsPage() {
  const [goals, setGoals] = useState<GoalResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newGoal, setNewGoal] = useState<GoalCreate>({
    name: '',
    target_amount: 0,
    current_amount: 0,
    deadline: '',
    category: ''
  });

  const fetchGoals = async () => {
    try {
      const data = await financeService.getGoals();
      setGoals(data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await financeService.createGoal(newGoal);
      setShowAddForm(false);
      setNewGoal({ name: '', target_amount: 0, current_amount: 0, deadline: '', category: '' });
      fetchGoals();
    } catch (error) {
      console.error('Error adding goal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGoal = async (id: number) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;
    try {
      await financeService.deleteGoal(id);
      fetchGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-zinc-950">Savings Goals</h1>
            <p className="text-zinc-500 mt-1">Plan for the future and track your progress.</p>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="btn-primary"
          >
            <Plus size={18} />
            New Goal
          </button>
        </div>

        {showAddForm && (
          <div className="fixed inset-0 bg-zinc-950/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-zinc-100 animate-in fade-in zoom-in duration-200">
              <h2 className="text-2xl font-bold mb-6">Create Savings Goal</h2>
              <form onSubmit={handleAddGoal} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Goal Name</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. New Car, House Deposit"
                    className="input-field"
                    value={newGoal.name}
                    onChange={e => setNewGoal({...newGoal, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Target ($)</label>
                    <input 
                      type="number"
                      required
                      className="input-field"
                      value={newGoal.target_amount || ''}
                      onChange={e => setNewGoal({...newGoal, target_amount: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Saved So Far ($)</label>
                    <input 
                      type="number"
                      className="input-field"
                      value={newGoal.current_amount || ''}
                      onChange={e => setNewGoal({...newGoal, current_amount: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Category</label>
                  <select 
                    className="input-field"
                    required
                    value={newGoal.category}
                    onChange={e => setNewGoal({...newGoal, category: e.target.value})}
                  >
                    <option value="">Select Category</option>
                    <option value="Travel">Travel</option>
                    <option value="Housing">Housing</option>
                    <option value="Vehicle">Vehicle</option>
                    <option value="Education">Education</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Target Date</label>
                  <input 
                    type="date"
                    className="input-field"
                    value={newGoal.deadline || ''}
                    onChange={e => setNewGoal({...newGoal, deadline: e.target.value})}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 px-4 py-2 border border-zinc-200 rounded-lg font-medium text-zinc-600 hover:bg-zinc-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 btn-primary justify-center"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Create Goal'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            [1, 2, 3].map(i => <div key={i} className="h-48 bg-zinc-50 rounded-2xl animate-pulse border border-zinc-100" />)
          ) : goals.map(goal => {
            const progress = Math.min((goal.current_amount / goal.target_amount) * 100, 100);
            return (
              <div key={goal.id} className="card p-6 border-zinc-100 flex flex-col group relative overflow-hidden">
                <button 
                  onClick={() => handleDeleteGoal(goal.id)}
                  className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-zinc-950 rounded-2xl text-white">
                    <Target size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-900">{goal.name}</h3>
                    <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">{goal.category}</p>
                  </div>
                </div>

                <div className="space-y-4 flex-1">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-2xl font-black text-zinc-950">${goal.current_amount.toLocaleString()}</p>
                      <p className="text-xs font-bold text-zinc-400">OF ${goal.target_amount.toLocaleString()} TARGET</p>
                    </div>
                    <p className="text-sm font-black text-zinc-900">{progress.toFixed(0)}%</p>
                  </div>

                  <div className="w-full bg-zinc-100 rounded-full h-3">
                    <div 
                      className={cn(
                        "h-3 rounded-full transition-all duration-1000",
                        progress === 100 ? 'bg-green-500' : 'bg-zinc-950'
                      )}
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {goal.deadline && (
                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 pt-2">
                      <Calendar size={14} />
                      Target: {new Date(goal.deadline).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {!loading && goals.length === 0 && (
            <div className="col-span-full py-20 text-center card border-dashed border-2 border-zinc-200 bg-transparent">
              <div className="bg-zinc-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target size={24} className="text-zinc-300" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">No savings goals yet</h3>
              <p className="text-zinc-500 mt-1">Create your first goal to start tracking your progress.</p>
              <button 
                onClick={() => setShowAddForm(true)}
                className="btn-primary mt-6"
              >
                <Plus size={18} />
                Create Goal
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

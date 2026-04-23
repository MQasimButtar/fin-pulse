import api from '@/lib/api';
import { 
  TransactionCreate, 
  TransactionResponse, 
  BudgetCreate, 
  BudgetResponse 
} from '@/types/finance';
import { GoalCreate, GoalResponse } from '@/types/goals';

export const financeService = {
  // Transactions
  async getTransactions(): Promise<TransactionResponse[]> {
    const response = await api.get('/transactions');
    return response.data;
  },

  async createTransaction(data: TransactionCreate): Promise<TransactionResponse> {
    const response = await api.post('/transactions', data);
    return response.data;
  },

  async deleteTransaction(id: number): Promise<void> {
    await api.delete(`/transactions/${id}`);
  },

  // Budgets
  async getBudgets(): Promise<BudgetResponse[]> {
    const response = await api.get('/budgets');
    return response.data;
  },

  async createBudget(data: BudgetCreate): Promise<BudgetResponse> {
    const response = await api.post('/budgets', data);
    return response.data;
  },

  async deleteBudget(id: number): Promise<void> {
    await api.delete(`/budgets/${id}`);
  },

  // Goals
  async getGoals(): Promise<GoalResponse[]> {
    const response = await api.get('/goals');
    return response.data;
  },

  async createGoal(data: GoalCreate): Promise<GoalResponse> {
    const response = await api.post('/goals', data);
    return response.data;
  },

  async deleteGoal(id: number): Promise<void> {
    await api.delete(`/goals/${id}`);
  },
};

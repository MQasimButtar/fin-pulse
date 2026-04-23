export interface TransactionBase {
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
}

export interface TransactionCreate extends TransactionBase {}

export interface TransactionResponse extends TransactionBase {
  id: number;
}

export interface BudgetBase {
  category: string;
  limit: number;
  period: string;
}

export interface BudgetCreate extends BudgetBase {}

export interface BudgetResponse extends BudgetBase {
  id: number;
}

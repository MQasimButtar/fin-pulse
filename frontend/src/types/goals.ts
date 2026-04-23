export interface GoalBase {
  name: string;
  target_amount: number;
  current_amount: number;
  deadline?: string;
  category: string;
}

export interface GoalCreate extends GoalBase {}

export interface GoalResponse extends GoalBase {
  id: number;
}

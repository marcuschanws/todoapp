export interface Task {
  id: number;
  identifier: string;
  description: string;
  deadline?: string;
  isDone: boolean;
  isPriority: boolean;
  createdAt: string;
}
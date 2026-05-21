export type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string; // ISO string
  completed: boolean;
  createdAt: string; // ISO string
}

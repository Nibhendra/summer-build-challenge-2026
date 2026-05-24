export interface Deadline {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
  type: 'Assignment' | 'Test' | 'Project' | 'Viva' | 'Exam' | 'Other';
  status: 'Pending' | 'Done';
  createdAt: string;
}

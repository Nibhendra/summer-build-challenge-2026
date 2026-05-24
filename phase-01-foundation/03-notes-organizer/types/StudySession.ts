export interface StudySession {
  id: string;
  subject: string;
  topic?: string;
  date: string;
  durationMinutes: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: 'Planned' | 'Completed' | 'Missed';
  createdAt: string;
}

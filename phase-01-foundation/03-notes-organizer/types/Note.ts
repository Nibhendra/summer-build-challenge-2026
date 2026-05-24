export interface Note {
  id: string;
  title: string;
  content: string;
  subject: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
  color: string;
  tags?: string[];
  priority?: 'Low' | 'Medium' | 'High';
  favorite?: boolean;
  importantPoints?: string[];
  summary?: string;
  checklist?: { id: string; text: string; completed: boolean }[];
  confidence?: 'Weak' | 'Average' | 'Strong';
  revisionDates?: string[];
  nextRevisionDate?: string;
}

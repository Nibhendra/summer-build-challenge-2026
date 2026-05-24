export interface Subject {
  key: string;
  label: string;
  color: string;
  icon: string;
}

export const SUBJECTS: Subject[] = [
  { key: 'all',        label: 'All',         color: '#888888', icon: 'apps-outline' },
  { key: 'math',       label: 'Math',         color: '#6C63FF', icon: 'calculator-outline' },
  { key: 'science',    label: 'Science',      color: '#00D4AA', icon: 'flask-outline' },
  { key: 'history',    label: 'History',      color: '#FF6B6B', icon: 'hourglass-outline' },
  { key: 'english',    label: 'English',      color: '#FFB347', icon: 'book-outline' },
  { key: 'computer',   label: 'Computer',     color: '#4ECDC4', icon: 'laptop-outline' },
  { key: 'physics',    label: 'Physics',      color: '#45B7D1', icon: 'planet-outline' },
  { key: 'chemistry',  label: 'Chemistry',    color: '#96CEB4', icon: 'beaker-outline' },
  { key: 'biology',    label: 'Biology',      color: '#88D8A3', icon: 'leaf-outline' },
  { key: 'geography',  label: 'Geography',    color: '#E8A0BF', icon: 'map-outline' },
  { key: 'general',    label: 'General',      color: '#A0A0A0', icon: 'document-text-outline' },
];

export const NOTE_SUBJECTS = SUBJECTS.filter((s) => s.key !== 'all');

export const getSubject = (key: string): Subject =>
  SUBJECTS.find((s) => s.key === key) ?? SUBJECTS[SUBJECTS.length - 1];

import { Note } from '../types/Note';
import { Deadline } from '../types/Deadline';
import { StudySession } from '../types/StudySession';

const now = new Date();
const d = (daysAgo: number) => {
  const date = new Date(now);
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

export const SAMPLE_NOTES: Note[] = [
  {
    id: 'sample-1',
    title: 'Newton\'s Laws of Motion',
    content:
      'Three fundamental laws describing the relationship between motion and force:\n\n1. An object at rest stays at rest unless acted upon by an external force.\n2. F = ma (Force equals mass times acceleration).\n3. For every action, there is an equal and opposite reaction.\n\nApplications: rocket propulsion, car safety systems, sports biomechanics.',
    subject: 'physics',
    pinned: true,
    createdAt: d(7),
    updatedAt: d(7),
    color: '#45B7D1',
    tags: ['kinematics', 'dynamics', 'basics'],
    priority: 'High',
    favorite: true,
    confidence: 'Average',
    revisionDates: [d(-1), d(-3), d(-7)],
    nextRevisionDate: d(-1),
  },
  {
    id: 'sample-2',
    title: 'Quadratic Formula',
    content:
      'For ax² + bx + c = 0, the solution is:\n\nx = (-b ± √(b² - 4ac)) / 2a\n\nThe discriminant (b² - 4ac):\n• > 0 → two real solutions\n• = 0 → one real solution\n• < 0 → no real solutions (complex)',
    subject: 'math',
    pinned: true,
    createdAt: d(5),
    updatedAt: d(2),
    color: '#6C63FF',
    tags: ['algebra', 'equations'],
    priority: 'Medium',
    favorite: false,
    confidence: 'Strong',
  },
  {
    id: 'sample-3',
    title: 'Photosynthesis Process',
    content:
      '6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂\n\nTwo stages:\n• Light-dependent reactions (thylakoid) – ATP and NADPH produced\n• Calvin Cycle / Light-independent (stroma) – glucose synthesized\n\nChlorophyll absorbs red and blue light, reflects green.',
    subject: 'biology',
    pinned: false,
    createdAt: d(10),
    updatedAt: d(10),
    color: '#88D8A3',
    tags: ['plants', 'energy'],
    priority: 'Low',
    favorite: false,
    confidence: 'Weak',
    nextRevisionDate: d(0), // due today
  },
];

export const SAMPLE_SESSIONS: StudySession[] = [
  {
    id: 'session-1',
    subject: 'physics',
    topic: 'Kinematics',
    date: d(0),
    durationMinutes: 45,
    difficulty: 'Medium',
    status: 'Completed',
    createdAt: d(1),
  },
  {
    id: 'session-2',
    subject: 'math',
    topic: 'Calculus',
    date: d(0),
    durationMinutes: 60,
    difficulty: 'Hard',
    status: 'Planned',
    createdAt: d(1),
  },
  {
    id: 'session-3',
    subject: 'biology',
    topic: 'Cell Structure',
    date: d(-1),
    durationMinutes: 30,
    difficulty: 'Easy',
    status: 'Planned',
    createdAt: d(2),
  }
];

export const SAMPLE_DEADLINES: Deadline[] = [
  {
    id: 'deadline-1',
    title: 'Math Assignment 4',
    subject: 'math',
    dueDate: d(-2),
    priority: 'High',
    type: 'Assignment',
    status: 'Pending',
    createdAt: d(5),
  },
  {
    id: 'deadline-2',
    title: 'Physics Midterm',
    subject: 'physics',
    dueDate: d(-7),
    priority: 'High',
    type: 'Exam',
    status: 'Pending',
    createdAt: d(10),
  },
  {
    id: 'deadline-3',
    title: 'Biology Lab Report',
    subject: 'biology',
    dueDate: d(1),
    priority: 'Medium',
    type: 'Assignment',
    status: 'Done',
    createdAt: d(8),
  }
];

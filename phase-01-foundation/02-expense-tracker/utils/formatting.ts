import { Expense } from '../types/expense';

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function formatDayOfWeek(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { weekday: 'short' });
}

export function toLocalISOString(date: Date): string {
  const tzOffset = date.getTimezoneOffset() * 60000;
  const localTime = new Date(date.getTime() - tzOffset);
  return localTime.toISOString().split('T')[0];
}

export function todayISO(): string {
  return toLocalISOString(new Date());
}

export function currentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function isSameDay(dateStr: string, compare: string): boolean {
  return dateStr.startsWith(compare);
}

export function isSameMonth(dateStr: string, monthKey: string): boolean {
  return dateStr.startsWith(monthKey);
}

export function getTodayExpenses(expenses: Expense[]): Expense[] {
  const today = todayISO();
  return expenses.filter((e) => e.date === today);
}

export function getMonthExpenses(expenses: Expense[]): Expense[] {
  const month = currentMonthKey();
  return expenses.filter((e) => e.date.startsWith(month));
}

export function sumAmount(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Group expenses by date label (Today, Yesterday, date string)
export function groupExpensesByDate(expenses: Expense[]): { label: string; data: Expense[] }[] {
  const today = todayISO();
  const yesterday = toLocalISOString(new Date(Date.now() - 86400000));
  const map: Record<string, Expense[]> = {};

  for (const e of expenses) {
    const key = e.date === today ? 'Today' : e.date === yesterday ? 'Yesterday' : formatDate(e.date);
    if (!map[key]) map[key] = [];
    map[key].push(e);
  }

  return Object.entries(map).map(([label, data]) => ({ label, data }));
}

// Get last N days labels for chart
export function getLastNDays(n: number): string[] {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (n - 1 - i));
    return toLocalISOString(d);
  });
}

export function getDailyTotals(expenses: Expense[], days: string[]): number[] {
  return days.map((day) => sumAmount(expenses.filter((e) => e.date === day)));
}

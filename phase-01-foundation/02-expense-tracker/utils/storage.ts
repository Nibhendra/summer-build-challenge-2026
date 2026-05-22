import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense, AppSettings } from '../types/expense';

const EXPENSES_KEY = '@spendwise_expenses';
const SETTINGS_KEY = '@spendwise_settings';

// ── Expenses ──────────────────────────────────────────────

export async function loadExpenses(): Promise<Expense[]> {
  try {
    const raw = await AsyncStorage.getItem(EXPENSES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveExpenses(expenses: Expense[]): Promise<void> {
  await AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
}

export async function addExpense(expense: Expense): Promise<Expense[]> {
  const existing = await loadExpenses();
  const updated = [expense, ...existing];
  await saveExpenses(updated);
  return updated;
}

export async function updateExpense(updated: Expense): Promise<Expense[]> {
  const existing = await loadExpenses();
  const list = existing.map((e) => (e.id === updated.id ? updated : e));
  await saveExpenses(list);
  return list;
}

export async function deleteExpense(id: string): Promise<Expense[]> {
  const existing = await loadExpenses();
  const list = existing.filter((e) => e.id !== id);
  await saveExpenses(list);
  return list;
}

export async function clearAllExpenses(): Promise<void> {
  await AsyncStorage.removeItem(EXPENSES_KEY);
}

// ── Settings ──────────────────────────────────────────────

const DEFAULT_SETTINGS: AppSettings = {
  monthlyBudget: 10000,
};

export async function loadSettings(): Promise<AppSettings> {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

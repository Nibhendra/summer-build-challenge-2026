import { useState, useEffect, useCallback } from 'react';
import { Expense, AppSettings } from '../types/expense';
import {
  loadExpenses,
  addExpense as storageAdd,
  updateExpense as storageUpdate,
  deleteExpense as storageDelete,
  clearAllExpenses,
  loadSettings,
  saveSettings,
} from '../utils/storage';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [settings, setSettings] = useState<AppSettings>({ monthlyBudget: 10000 });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [exp, set] = await Promise.all([loadExpenses(), loadSettings()]);
    setExpenses(exp);
    setSettings(set);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addExpense = useCallback(async (expense: Expense) => {
    const updated = await storageAdd(expense);
    setExpenses(updated);
  }, []);

  const updateExpense = useCallback(async (expense: Expense) => {
    const updated = await storageUpdate(expense);
    setExpenses(updated);
  }, []);

  const deleteExpense = useCallback(async (id: string) => {
    const updated = await storageDelete(id);
    setExpenses(updated);
  }, []);

  const clearAll = useCallback(async () => {
    await clearAllExpenses();
    setExpenses([]);
  }, []);

  const updateSettings = useCallback(async (s: AppSettings) => {
    await saveSettings(s);
    setSettings(s);
  }, []);

  return {
    expenses,
    settings,
    loading,
    reload: load,
    addExpense,
    updateExpense,
    deleteExpense,
    clearAll,
    updateSettings,
  };
}

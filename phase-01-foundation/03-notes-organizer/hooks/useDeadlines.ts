import { useState, useEffect, useCallback } from 'react';
import { Deadline } from '../types/Deadline';
import { StorageService } from '../utils/storage';
import { SAMPLE_DEADLINES } from '../constants/SampleData';

export function useDeadlines() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        let loaded = await StorageService.getItem<Deadline[]>('deadlines');
        if (!loaded) {
          loaded = SAMPLE_DEADLINES;
          await StorageService.setItem('deadlines', loaded);
        }
        setDeadlines(loaded as Deadline[]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = useCallback(async (updated: Deadline[]) => {
    setDeadlines(updated);
    await StorageService.setItem('deadlines', updated);
  }, []);

  const addDeadline = useCallback(async (data: Omit<Deadline, 'id' | 'createdAt'>) => {
    const newDeadline: Deadline = {
      ...data,
      id: `deadline-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    await persist([...deadlines, newDeadline]);
  }, [deadlines, persist]);

  const toggleStatus = useCallback(async (id: string) => {
    const updated = deadlines.map(d => 
      d.id === id ? { ...d, status: d.status === 'Done' ? 'Pending' as const : 'Done' as const } : d
    );
    await persist(updated);
  }, [deadlines, persist]);

  return {
    deadlines,
    loading,
    addDeadline,
    toggleStatus,
  };
}

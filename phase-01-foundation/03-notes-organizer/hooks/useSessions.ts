import { useState, useEffect, useCallback } from 'react';
import { StudySession } from '../types/StudySession';
import { StorageService } from '../utils/storage';
import { SAMPLE_SESSIONS } from '../constants/SampleData';

export function useSessions() {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        // Using a similar approach, we load or seed
        // In a real app we'd have a unified init, but this works for MVP
        let loaded = await StorageService.getItem<StudySession[]>('sessions');
        if (!loaded) {
          loaded = SAMPLE_SESSIONS;
          await StorageService.setItem('sessions', loaded);
        }
        setSessions(loaded as StudySession[]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = useCallback(async (updated: StudySession[]) => {
    setSessions(updated);
    await StorageService.setItem('sessions', updated);
  }, []);

  const addSession = useCallback(async (data: Omit<StudySession, 'id' | 'createdAt'>) => {
    const newSession: StudySession = {
      ...data,
      id: `session-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    await persist([...sessions, newSession]);
  }, [sessions, persist]);

  const updateSessionStatus = useCallback(async (id: string, status: StudySession['status']) => {
    const updated = sessions.map(s => s.id === id ? { ...s, status } : s);
    await persist(updated);
  }, [sessions, persist]);

  return {
    sessions,
    loading,
    addSession,
    updateSessionStatus,
  };
}

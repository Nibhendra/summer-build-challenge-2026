import { useState, useEffect, useCallback } from 'react';
import { Note } from '../types/Note';
import { StorageService } from '../utils/storage';
import { SAMPLE_NOTES } from '../constants/SampleData';
import { NoteColors } from '../constants/Colors';

let globalId = Date.now();
const generateId = () => `note-${++globalId}-${Math.random().toString(36).slice(2, 8)}`;

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load notes on mount, seed sample data on first launch
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const initialized = await StorageService.isInitialized();
        if (!initialized) {
          await StorageService.saveNotes(SAMPLE_NOTES);
          await StorageService.markInitialized();
          setNotes(SAMPLE_NOTES);
        } else {
          const loaded = await StorageService.loadNotes();
          setNotes(loaded);
        }
      } catch (e) {
        setError('Failed to load notes. Please restart the app.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /**
   * Persist notes helper
   */
  const persist = useCallback(async (updated: Note[]) => {
    setNotes(updated);
    await StorageService.saveNotes(updated);
  }, []);

  /**
   * Add a new note
   */
  const addNote = useCallback(
    async (data: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newNote: Note = {
        ...data,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updated = [newNote, ...notes];
      await persist(updated);
      return newNote;
    },
    [notes, persist]
  );

  /**
   * Update an existing note
   */
  const updateNote = useCallback(
    async (id: string, data: Partial<Omit<Note, 'id' | 'createdAt'>>) => {
      const updated = notes.map((n) =>
        n.id === id ? { ...n, ...data, updatedAt: new Date().toISOString() } : n
      );
      await persist(updated);
    },
    [notes, persist]
  );

  /**
   * Delete a note by id
   */
  const deleteNote = useCallback(
    async (id: string) => {
      const updated = notes.filter((n) => n.id !== id);
      await persist(updated);
    },
    [notes, persist]
  );

  /**
   * Toggle pin status
   */
  const togglePin = useCallback(
    async (id: string) => {
      const updated = notes.map((n) =>
        n.id === id ? { ...n, pinned: !n.pinned, updatedAt: new Date().toISOString() } : n
      );
      await persist(updated);
    },
    [notes, persist]
  );

  /**
   * Get a single note by id
   */
  const getNoteById = useCallback(
    (id: string): Note | undefined => notes.find((n) => n.id === id),
    [notes]
  );

  /**
   * Clear all notes and reset to sample data
   */
  const resetToSampleData = useCallback(async () => {
    await StorageService.saveNotes(SAMPLE_NOTES);
    setNotes(SAMPLE_NOTES);
  }, []);

  /**
   * Clear all notes
   */
  const clearAllNotes = useCallback(async () => {
    await StorageService.clearAll();
    setNotes([]);
  }, []);

  /**
   * Get a random note color
   */
  const getRandomColor = () => NoteColors[Math.floor(Math.random() * NoteColors.length)];

  return {
    notes,
    loading,
    error,
    addNote,
    updateNote,
    deleteNote,
    togglePin,
    getNoteById,
    clearAllNotes,
    resetToSampleData,
    getRandomColor,
  };
}

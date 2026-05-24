import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from '../types/Note';

const NOTES_KEY = '@notes_organizer_notes';
const INITIALIZED_KEY = '@notes_organizer_initialized';

export const StorageService = {
  /**
   * Load all notes from storage
   */
  async loadNotes(): Promise<Note[]> {
    try {
      const raw = await AsyncStorage.getItem(NOTES_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as Note[];
    } catch (e) {
      console.error('[Storage] Failed to load notes:', e);
      return [];
    }
  },

  /**
   * Save all notes to storage
   */
  async saveNotes(notes: Note[]): Promise<void> {
    try {
      await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    } catch (e) {
      console.error('[Storage] Failed to save notes:', e);
    }
  },

  /**
   * Check if the app has been initialized (first launch seeding)
   */
  async isInitialized(): Promise<boolean> {
    try {
      const val = await AsyncStorage.getItem(INITIALIZED_KEY);
      return val === 'true';
    } catch {
      return false;
    }
  },

  /**
   * Mark the app as initialized
   */
  async markInitialized(): Promise<void> {
    try {
      await AsyncStorage.setItem(INITIALIZED_KEY, 'true');
    } catch (e) {
      console.error('[Storage] Failed to mark initialized:', e);
    }
  },

  /**
   * Clear all app data
   */
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([NOTES_KEY, INITIALIZED_KEY]);
    } catch (e) {
      console.error('[Storage] Failed to clear data:', e);
    }
  },
  /**
   * Generic get item
   */
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  /**
   * Generic set item
   */
  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`[Storage] Failed to save ${key}:`, e);
    }
  },
};

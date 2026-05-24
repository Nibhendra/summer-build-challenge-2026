import { useMemo, useState } from 'react';
import { Note } from '../types/Note';

export function useSearch(notes: Note[]) {
  const [query, setQuery] = useState('');
  const [activeSubject, setActiveSubject] = useState('all');

  const filteredNotes = useMemo(() => {
    let result = [...notes];

    // Filter by subject
    if (activeSubject !== 'all') {
      result = result.filter((n) => n.subject === activeSubject);
    }

    // Filter by search query
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.subject.toLowerCase().includes(q)
      );
    }

    // Sort: pinned first, then by updatedAt
    result.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    return result;
  }, [notes, query, activeSubject]);

  const pinnedNotes = useMemo(
    () => filteredNotes.filter((n) => n.pinned),
    [filteredNotes]
  );

  const unpinnedNotes = useMemo(
    () => filteredNotes.filter((n) => !n.pinned),
    [filteredNotes]
  );

  return {
    query,
    setQuery,
    activeSubject,
    setActiveSubject,
    filteredNotes,
    pinnedNotes,
    unpinnedNotes,
  };
}

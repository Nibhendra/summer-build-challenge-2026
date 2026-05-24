import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNotes } from '../../hooks/useNotes';
import { useSearch } from '../../hooks/useSearch';
import { NoteCard } from '../../components/NoteCard';
import { SearchBar } from '../../components/SearchBar';
import { TagFilter } from '../../components/TagFilter';
import { EmptyState } from '../../components/EmptyState';
import { FloatingButton } from '../../components/FloatingButton';
import { Colors } from '../../constants/Colors';
import { Note } from '../../types/Note';


export default function HomeScreen() {
  const router = useRouter();
  const { notes, loading, error, togglePin } = useNotes();
  const { query, setQuery, activeSubject, setActiveSubject, filteredNotes, pinnedNotes, unpinnedNotes } =
    useSearch(notes);

  const handleNotePress = useCallback(
    (note: Note) => {
      router.push(`/note/${note.id}`);
    },
    [router]
  );

  const handleAddPress = useCallback(() => {
    router.push('/add');
  }, [router]);

  const handleSettingsPress = useCallback(() => {
    router.push('/settings');
  }, [router]);

  const renderHeader = () => (
    <View style={styles.listHeader}>
      {/* App Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>📚 Notes</Text>
          <Text style={styles.headerSubtitle}>
            {notes.length} {notes.length === 1 ? 'note' : 'notes'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={handleSettingsPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="settings-outline" size={22} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <SearchBar value={query} onChangeText={setQuery} />

      {/* Tag Filter */}
      <View style={styles.filterSection}>
        <TagFilter activeSubject={activeSubject} onSelectSubject={setActiveSubject} />
      </View>

      {/* Section labels */}
      {pinnedNotes.length > 0 && (
        <View style={styles.sectionHeader}>
          <Ionicons name="pin" size={13} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Pinned</Text>
        </View>
      )}
    </View>
  );

  const renderSectionDivider = () => {
    if (pinnedNotes.length > 0 && unpinnedNotes.length > 0) {
      return (
        <View style={styles.sectionHeader}>
          <Ionicons name="time-outline" size={13} color={Colors.textMuted} />
          <Text style={[styles.sectionTitle, { color: Colors.textMuted }]}>All Notes</Text>
        </View>
      );
    }
    return null;
  };

  const renderNote = useCallback(
    ({ item, index }: { item: Note; index: number }) => {
      // Insert the "All Notes" divider between pinned and unpinned
      const isFirstUnpinned = pinnedNotes.length > 0 && item.id === unpinnedNotes[0]?.id;
      return (
        <>
          {isFirstUnpinned && renderSectionDivider()}
          <NoteCard
            note={item}
            onPress={() => handleNotePress(item)}
            onLongPress={() => togglePin(item.id)}
          />
        </>
      );
    },
    [handleNotePress, togglePin, pinnedNotes, unpinnedNotes]
  );

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <EmptyState
        type={notes.length === 0 ? 'no-notes' : 'no-results'}
        query={query}
      />
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading your notes…</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Ionicons name="warning-outline" size={48} color={Colors.danger} />
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        renderItem={renderNote}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={[
          styles.listContent,
          filteredNotes.length === 0 && styles.listContentEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={false}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      />

      <FloatingButton onPress={handleAddPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingBottom: 100,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  listHeader: {
    gap: 12,
    paddingBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    fontFamily: 'Inter_700Bold',
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
    fontFamily: 'Inter_400Regular',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterSection: {
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 2,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontFamily: 'Inter_700Bold',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 32,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
});

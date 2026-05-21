import React, { useState, useMemo } from 'react';
import { StyleSheet, FlatList, View, ActivityIndicator, TextInput, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Plus, Search, Trash2 } from 'lucide-react-native';

import { Text } from '@/components/Themed';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useTasks } from '@/hooks/useTasks';
import { TaskCard } from '@/components/TaskCard';
import { FilterTabs, FilterOption } from '@/components/FilterTabs';
import { EmptyState } from '@/components/EmptyState';

export default function TabOneScreen() {
  const { tasks, isLoading, toggleTaskStatus, deleteTask, clearCompleted } = useTasks();
  const [filter, setFilter] = useState<FilterOption>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const filteredTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return tasks.filter(task => {
      // 1. Search Query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description?.toLowerCase().includes(query) || false;
        if (!matchesTitle && !matchesDesc) {
          return false;
        }
      }

      // 2. Tab Filter
      if (filter === 'All') return true;
      if (filter === 'Completed') return task.completed;
      
      // For Today and Upcoming, we usually ignore completed tasks unless they explicitly look for them
      if (task.completed) return false;

      if (!task.dueDate) return filter === 'Upcoming';

      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      if (filter === 'Today') {
        return dueDate.getTime() === today.getTime() || dueDate.getTime() < today.getTime(); 
      }
      
      if (filter === 'Upcoming') {
        return dueDate.getTime() > today.getTime();
      }

      return true;
    });
  }, [tasks, filter, searchQuery]);

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  const hasCompletedTasks = tasks.some(t => t.completed);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Search size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search tasks..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FilterTabs currentFilter={filter} onFilterChange={setFilter} />
      
      {filter === 'Completed' && hasCompletedTasks && (
        <View style={styles.clearContainer}>
          <Pressable 
            style={[styles.clearButton, { backgroundColor: colors.danger + '1A' }]} 
            onPress={clearCompleted}
          >
            <Trash2 size={16} color={colors.danger} />
            <Text style={[styles.clearText, { color: colors.danger }]}>Clear All Completed</Text>
          </Pressable>
        </View>
      )}

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard 
            task={item} 
            onToggle={toggleTaskStatus} 
            onDelete={deleteTask} 
          />
        )}
        ListEmptyComponent={
          <EmptyState 
            message={
              searchQuery ? `No results for "${searchQuery}"` :
              filter === 'Completed' ? "No completed tasks yet" :
              filter === 'Today' ? "No tasks for today. You're all caught up!" :
              "No tasks found. Add one to get started."
            } 
          />
        }
        contentContainerStyle={styles.listContent}
      />

      <Link href="/add" asChild>
        <Pressable style={styles.fabContainer}>
          <View style={[styles.fab, { backgroundColor: colors.tint }]}>
            <Plus size={32} color="#ffffff" />
          </View>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 12,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  clearContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  clearText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 100, // Space for FAB
  },
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDeadlines } from '../../hooks/useDeadlines';
import { DeadlineCard } from '../../components/DeadlineCard';
import { SectionHeader } from '../../components/SectionHeader';
import { Ionicons } from '@expo/vector-icons';

export default function DeadlinesScreen() {
  const { deadlines, toggleStatus } = useDeadlines();

  const pending = deadlines.filter(d => d.status === 'Pending').sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const done = deadlines.filter(d => d.status === 'Done');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Deadlines</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Pending */}
        <SectionHeader title="Pending" />
        {pending.length > 0 ? (
          pending.map(deadline => (
            <DeadlineCard 
              key={deadline.id} 
              deadline={deadline} 
              onToggleStatus={() => toggleStatus(deadline.id)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-done-circle-outline" size={32} color={Colors.accent} />
            <Text style={styles.emptyText}>All caught up!</Text>
          </View>
        )}

        {/* Done */}
        {done.length > 0 && (
          <>
            <SectionHeader title="Completed" />
            {done.map(deadline => (
              <DeadlineCard 
                key={deadline.id} 
                deadline={deadline} 
                onToggleStatus={() => toggleStatus(deadline.id)}
              />
            ))}
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    color: Colors.textPrimary,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: Colors.cardAlt,
    borderRadius: 16,
    gap: 8,
  },
  emptyText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textMuted,
  },
});

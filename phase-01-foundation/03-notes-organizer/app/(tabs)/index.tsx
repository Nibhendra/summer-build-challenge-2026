import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatCard } from '../../components/StatCard';
import { SectionHeader } from '../../components/SectionHeader';
import { DeadlineCard } from '../../components/DeadlineCard';
import { StudySessionCard } from '../../components/StudySessionCard';
import { useNotes } from '../../hooks/useNotes';
import { useSessions } from '../../hooks/useSessions';
import { useDeadlines } from '../../hooks/useDeadlines';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const router = useRouter();
  const { notes } = useNotes();
  const { sessions, updateSessionStatus } = useSessions();
  const { deadlines, toggleStatus } = useDeadlines();

  // Metrics
  const today = new Date().toISOString().split('T')[0];
  const todaySessions = sessions.filter(s => s.date.startsWith(today));
  const pendingDeadlines = deadlines.filter(d => d.status === 'Pending');
  
  // Calculate due revisions (notes with nextRevisionDate <= today)
  const dueRevisions = notes.filter(n => n.nextRevisionDate && n.nextRevisionDate <= new Date().toISOString());

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello there, Student 👋</Text>
            <Text style={styles.subtitle}>Here is your academic overview</Text>
          </View>
          <TouchableOpacity style={styles.profileBtn}>
            <Ionicons name="person-circle" size={36} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsRow}>
          <StatCard title="Total Notes" value={notes.length} icon="document-text" color={Colors.primary} />
          <StatCard title="Due Revisions" value={dueRevisions.length} icon="sync" color={Colors.warning} />
        </View>
        <View style={styles.statsRow}>
          <StatCard title="Pending Deadlines" value={pendingDeadlines.length} icon="alert-circle" color={Colors.danger} />
          <StatCard title="Today's Sessions" value={todaySessions.length} icon="calendar" color={Colors.accent} />
        </View>

        {/* Smart Suggestions */}
        <SectionHeader title="Smart Suggestions" />
        <View style={styles.suggestionCard}>
          <Ionicons name="bulb-outline" size={24} color={Colors.warning} style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            {dueRevisions.length > 0 ? (
              <Text style={styles.suggestionText}>You have {dueRevisions.length} notes due for revision today.</Text>
            ) : pendingDeadlines.length > 0 ? (
              <Text style={styles.suggestionText}>Focus on your {pendingDeadlines.length} pending deadlines.</Text>
            ) : (
              <Text style={styles.suggestionText}>You're all caught up! Consider reviewing weak topics.</Text>
            )}
          </View>
        </View>

        {/* Today's Schedule */}
        <SectionHeader 
          title="Today's Schedule" 
          actionText="See all" 
          onAction={() => router.push('/scheduler' as any)} 
        />
        {todaySessions.length > 0 ? (
          todaySessions.map(session => (
            <StudySessionCard 
              key={session.id} 
              session={session} 
              onToggleStatus={() => updateSessionStatus(session.id, session.status === 'Completed' ? 'Planned' : 'Completed')}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>No sessions planned for today.</Text>
        )}

        {/* Upcoming Deadlines */}
        <SectionHeader 
          title="Upcoming Deadlines" 
          actionText="See all" 
          onAction={() => router.push('/deadlines' as any)} 
        />
        {pendingDeadlines.slice(0, 3).map(deadline => (
          <DeadlineCard 
            key={deadline.id} 
            deadline={deadline} 
            onToggleStatus={() => toggleStatus(deadline.id)}
          />
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  profileBtn: {
    padding: 4,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 12,
    marginHorizontal: -6, // offset the card margins
  },
  suggestionCard: {
    backgroundColor: Colors.cardAlt,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  suggestionText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  emptyText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingVertical: 20,
    backgroundColor: Colors.surface,
    borderRadius: 12,
  },
});

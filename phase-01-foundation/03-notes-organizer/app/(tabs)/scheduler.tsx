import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSessions } from '../../hooks/useSessions';
import { StudySessionCard } from '../../components/StudySessionCard';
import { SectionHeader } from '../../components/SectionHeader';
import { Ionicons } from '@expo/vector-icons';

export default function SchedulerScreen() {
  const { sessions, updateSessionStatus } = useSessions();

  const today = new Date().toISOString().split('T')[0];
  const todaySessions = sessions.filter(s => s.date.startsWith(today));
  const otherSessions = sessions.filter(s => !s.date.startsWith(today));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Study Schedule</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Today */}
        <SectionHeader title="Today" />
        {todaySessions.length > 0 ? (
          todaySessions.map(session => (
            <StudySessionCard 
              key={session.id} 
              session={session} 
              onToggleStatus={() => updateSessionStatus(session.id, session.status === 'Completed' ? 'Planned' : 'Completed')}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-clear-outline" size={32} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No sessions today</Text>
          </View>
        )}

        {/* Other */}
        <SectionHeader title="Upcoming" />
        {otherSessions.length > 0 ? (
          otherSessions.map(session => (
            <StudySessionCard 
              key={session.id} 
              session={session} 
              onToggleStatus={() => updateSessionStatus(session.id, session.status === 'Completed' ? 'Planned' : 'Completed')}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No upcoming sessions</Text>
          </View>
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

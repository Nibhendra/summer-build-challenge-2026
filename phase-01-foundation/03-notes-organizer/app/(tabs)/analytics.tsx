import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotes } from '../../hooks/useNotes';
import { useSessions } from '../../hooks/useSessions';
import { useDeadlines } from '../../hooks/useDeadlines';
import { StatCard } from '../../components/StatCard';
import { SectionHeader } from '../../components/SectionHeader';

export default function AnalyticsScreen() {
  const { notes } = useNotes();
  const { sessions } = useSessions();
  const { deadlines } = useDeadlines();

  const completedSessions = sessions.filter(s => s.status === 'Completed').length;
  const missedSessions = sessions.filter(s => s.status === 'Missed').length;
  
  const completedDeadlines = deadlines.filter(d => d.status === 'Done').length;
  const pendingDeadlines = deadlines.filter(d => d.status === 'Pending').length;

  const totalStudyMinutes = sessions
    .filter(s => s.status === 'Completed')
    .reduce((acc, curr) => acc + curr.durationMinutes, 0);

  const studyHours = Math.floor(totalStudyMinutes / 60);
  const studyMinutes = totalStudyMinutes % 60;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Overview */}
        <SectionHeader title="Study Time" />
        <View style={styles.statsRow}>
          <StatCard 
            title="Total Study Time" 
            value={`${studyHours}h ${studyMinutes}m`} 
            icon="time" 
            color={Colors.primary} 
          />
        </View>

        <SectionHeader title="Sessions" />
        <View style={styles.statsRow}>
          <StatCard 
            title="Completed" 
            value={completedSessions} 
            icon="checkmark-circle" 
            color={Colors.accent} 
          />
          <StatCard 
            title="Missed" 
            value={missedSessions} 
            icon="close-circle" 
            color={Colors.danger} 
          />
        </View>

        <SectionHeader title="Deadlines" />
        <View style={styles.statsRow}>
          <StatCard 
            title="Done" 
            value={completedDeadlines} 
            icon="flag" 
            color={Colors.accent} 
          />
          <StatCard 
            title="Pending" 
            value={pendingDeadlines} 
            icon="alert-circle" 
            color={Colors.warning} 
          />
        </View>

        <SectionHeader title="Notes Repository" />
        <View style={styles.statsRow}>
          <StatCard 
            title="Total Notes" 
            value={notes.length} 
            icon="document-text" 
            color={Colors.primaryLight} 
          />
          <StatCard 
            title="Favorites" 
            value={notes.filter(n => n.favorite).length} 
            icon="star" 
            color={Colors.warning} 
          />
        </View>

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
  statsRow: {
    flexDirection: 'row',
    marginBottom: 12,
    marginHorizontal: -6,
  },
});

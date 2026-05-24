import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNotes } from '../hooks/useNotes';
import { Colors } from '../constants/Colors';
import { getSubject, NOTE_SUBJECTS } from '../constants/Subjects';

const APP_VERSION = '1.0.0';
const CHALLENGE = 'Summer Build Challenge 2026';
const PHASE = 'Phase 01 – Foundation';
const DAY = 'Day 03 · Notes Organizer';

const FUTURE_IMPROVEMENTS = [
  { icon: 'cloud-outline', text: 'Cloud sync with Supabase or Firebase' },
  { icon: 'sparkles-outline', text: 'AI auto-summarize with Gemini API' },
  { icon: 'search-outline', text: 'RAG-powered semantic search on notes' },
  { icon: 'notifications-outline', text: 'Study reminder notifications via Expo Notifications' },
  { icon: 'attach-outline', text: 'Attach photos & PDFs to notes' },
  { icon: 'person-outline', text: 'Multi-device auth via Clerk or Supabase Auth' },
  { icon: 'rocket-outline', text: 'Native build + App Store / Play Store deploy via EAS' },
  { icon: 'apps-outline', text: 'Home screen widget (iOS & Android)' },
  { icon: 'stats-chart-outline', text: 'Study analytics & progress charts' },
  { icon: 'mic-outline', text: 'Voice-to-note with speech recognition' },
];

interface StatCardProps {
  value: string | number;
  label: string;
  color: string;
  icon: string;
}

const StatCard: React.FC<StatCardProps> = ({ value, label, color, icon }) => (
  <View style={[styles.statCard, { borderColor: color + '30' }]}>
    <View style={[styles.statIconWrap, { backgroundColor: color + '18' }]}>
      <Ionicons name={icon as any} size={20} color={color} />
    </View>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export default function SettingsScreen() {
  const router = useRouter();
  const { notes, clearAllNotes, resetToSampleData } = useNotes();
  const [showFuture, setShowFuture] = useState(false);

  const pinnedCount = useMemo(() => notes.filter((n) => n.pinned).length, [notes]);
  const subjectsUsed = useMemo(
    () => [...new Set(notes.map((n) => n.subject))].length,
    [notes]
  );

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Notes',
      'This will permanently delete all your notes. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => clearAllNotes(),
        },
      ]
    );
  };

  const handleResetSamples = () => {
    Alert.alert(
      'Reset to Sample Data',
      'This will replace all notes with the original sample notes. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', onPress: () => resetToSampleData() },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Nav */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navButton}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Settings & About</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Challenge Badge */}
        <View style={styles.challengeBadge}>
          <View style={styles.challengeTop}>
            <Ionicons name="trophy-outline" size={22} color={Colors.warning} />
            <Text style={styles.challengeTitle}>{CHALLENGE}</Text>
          </View>
          <Text style={styles.challengePhase}>{PHASE}</Text>
          <Text style={styles.challengeDay}>{DAY}</Text>
          <View style={styles.versionRow}>
            <Text style={styles.versionText}>v{APP_VERSION}</Text>
            <View style={styles.dot} />
            <Text style={styles.versionText}>React Native + Expo</Text>
          </View>
        </View>

        {/* Stats */}
        <Text style={styles.sectionTitle}>Your Stats</Text>
        <View style={styles.statsRow}>
          <StatCard value={notes.length} label="Total Notes" color={Colors.primary} icon="document-text-outline" />
          <StatCard value={pinnedCount} label="Pinned" color={Colors.warning} icon="pin-outline" />
          <StatCard value={subjectsUsed} label="Subjects" color={Colors.accent} icon="bookmark-outline" />
        </View>

        {/* Subjects Used */}
        {subjectsUsed > 0 && (
          <>
            <Text style={styles.sectionTitle}>Subjects Used</Text>
            <View style={styles.card}>
              <View style={styles.subjectList}>
                {[...new Set(notes.map((n) => n.subject))].map((key) => {
                  const sub = getSubject(key);
                  const count = notes.filter((n) => n.subject === key).length;
                  return (
                    <View key={key} style={styles.subjectRow}>
                      <View style={[styles.subjectDot, { backgroundColor: sub.color }]} />
                      <Ionicons name={sub.icon as any} size={14} color={sub.color} />
                      <Text style={styles.subjectName}>{sub.label}</Text>
                      <Text style={[styles.subjectCount, { color: sub.color }]}>{count}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </>
        )}

        {/* Data Management */}
        <Text style={styles.sectionTitle}>Data</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.actionRow} onPress={handleResetSamples}>
            <View style={[styles.actionIcon, { backgroundColor: Colors.accent + '20' }]}>
              <Ionicons name="refresh-outline" size={18} color={Colors.accent} />
            </View>
            <View style={styles.actionBody}>
              <Text style={styles.actionLabel}>Reset to Sample Data</Text>
              <Text style={styles.actionSub}>Replace notes with demo content</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.actionRow} onPress={handleClearAll}>
            <View style={[styles.actionIcon, { backgroundColor: Colors.danger + '20' }]}>
              <Ionicons name="trash-outline" size={18} color={Colors.danger} />
            </View>
            <View style={styles.actionBody}>
              <Text style={[styles.actionLabel, { color: Colors.danger }]}>Clear All Notes</Text>
              <Text style={styles.actionSub}>Permanently delete all notes</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Future Improvements */}
        <TouchableOpacity
          style={styles.futureHeader}
          onPress={() => setShowFuture(!showFuture)}
        >
          <Text style={styles.sectionTitle}>Future Improvements</Text>
          <Ionicons
            name={showFuture ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={Colors.textMuted}
          />
        </TouchableOpacity>

        {showFuture && (
          <View style={styles.card}>
            {FUTURE_IMPROVEMENTS.map((item, i) => (
              <View key={i} style={styles.futureItem}>
                <View style={[styles.futureDot, { backgroundColor: Colors.primary + '20' }]}>
                  <Ionicons name={item.icon as any} size={14} color={Colors.primary} />
                </View>
                <Text style={styles.futureText}>{item.text}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Tech Stack */}
        <Text style={styles.sectionTitle}>Tech Stack</Text>
        <View style={styles.card}>
          {[
            ['Framework', 'React Native + Expo SDK 56'],
            ['Navigation', 'Expo Router (file-based)'],
            ['Storage', 'AsyncStorage (local)'],
            ['Icons', '@expo/vector-icons (Ionicons)'],
            ['Fonts', 'Inter via expo-google-fonts'],
            ['Language', 'TypeScript'],
          ].map(([label, value]) => (
            <View key={label} style={styles.techRow}>
              <Text style={styles.techLabel}>{label}</Text>
              <Text style={styles.techValue}>{value}</Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Built with ❤️ for {CHALLENGE}</Text>
          <Text style={styles.footerSub}>Local storage · No backend required · Expo Go ready</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  navButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    fontFamily: 'Inter_700Bold',
  },
  scrollContent: { padding: 16, paddingBottom: 50, gap: 8 },

  challengeBadge: {
    backgroundColor: Colors.primary + '12',
    borderWidth: 1,
    borderColor: Colors.primary + '30',
    borderRadius: 16,
    padding: 18,
    gap: 4,
    marginBottom: 8,
  },
  challengeTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  challengeTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.warning,
    fontFamily: 'Inter_700Bold',
  },
  challengePhase: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  challengeDay: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: 'Inter_400Regular',
  },
  versionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  versionText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontFamily: 'Inter_400Regular',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.textMuted,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 12,
    marginBottom: 4,
    fontFamily: 'Inter_700Bold',
  },

  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
  },
  statIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    fontFamily: 'Inter_700Bold',
  },
  statLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },

  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    marginBottom: 4,
  },

  subjectList: { padding: 4 },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 10,
  },
  subjectDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  subjectName: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
    fontFamily: 'Inter_400Regular',
  },
  subjectCount: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBody: { flex: 1 },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    fontFamily: 'Inter_600SemiBold',
  },
  actionSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 1,
    fontFamily: 'Inter_400Regular',
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 16,
  },

  futureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 4,
  },
  futureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  futureDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  futureText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: 'Inter_400Regular',
  },

  techRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  techLabel: {
    fontSize: 13,
    color: Colors.textMuted,
    fontFamily: 'Inter_400Regular',
  },
  techValue: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '500',
    fontFamily: 'Inter_600SemiBold',
    maxWidth: '60%',
    textAlign: 'right',
  },

  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 4,
  },
  footerText: {
    fontSize: 13,
    color: Colors.textMuted,
    fontFamily: 'Inter_400Regular',
  },
  footerSub: {
    fontSize: 11,
    color: Colors.textMuted + '80',
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
});

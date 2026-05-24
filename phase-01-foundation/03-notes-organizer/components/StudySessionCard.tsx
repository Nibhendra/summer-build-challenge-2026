import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { StudySession } from '../types/StudySession';

interface StudySessionCardProps {
  session: StudySession;
  onPress?: () => void;
  onToggleStatus?: () => void;
}

export function StudySessionCard({ session, onPress, onToggleStatus }: StudySessionCardProps) {
  const getDifficultyColor = () => {
    switch (session.difficulty) {
      case 'Easy':
        return Colors.accent;
      case 'Medium':
        return Colors.warning;
      case 'Hard':
        return Colors.danger;
      default:
        return Colors.textSecondary;
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftBorder} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.subject}>{session.subject.toUpperCase()}</Text>
          <View style={[styles.difficultyTag, { borderColor: getDifficultyColor() }]}>
            <Text style={[styles.difficultyText, { color: getDifficultyColor() }]}>
              {session.difficulty}
            </Text>
          </View>
        </View>

        <Text style={styles.topic}>{session.topic || 'General Study'}</Text>

        <View style={styles.footer}>
          <View style={styles.footerItem}>
            <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.footerText}>{session.durationMinutes} min</Text>
          </View>
          <View style={styles.footerItem}>
            <Ionicons
              name={
                session.status === 'Completed'
                  ? 'checkmark-circle'
                  : session.status === 'Missed'
                  ? 'close-circle'
                  : 'time'
              }
              size={14}
              color={
                session.status === 'Completed'
                  ? Colors.accent
                  : session.status === 'Missed'
                  ? Colors.danger
                  : Colors.textSecondary
              }
            />
            <Text style={styles.footerText}>{session.status}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.actionButton} onPress={onToggleStatus}>
        <Ionicons
          name={session.status === 'Completed' ? 'checkmark-circle' : 'ellipse-outline'}
          size={28}
          color={session.status === 'Completed' ? Colors.accent : Colors.textMuted}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  leftBorder: {
    width: 6,
    backgroundColor: Colors.primary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subject: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.primary,
  },
  difficultyTag: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: Colors.surface,
  },
  difficultyText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
  },
  topic: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    gap: 16,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  actionButton: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: Colors.border,
  },
});

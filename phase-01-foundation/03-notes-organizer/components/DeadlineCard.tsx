import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Deadline } from '../types/Deadline';

interface DeadlineCardProps {
  deadline: Deadline;
  onPress?: () => void;
  onToggleStatus?: () => void;
}

export function DeadlineCard({ deadline, onPress, onToggleStatus }: DeadlineCardProps) {
  // Simple days left calculation
  const getDaysLeft = () => {
    const due = new Date(deadline.dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysLeft();
  const isUrgent = daysLeft <= 2 && daysLeft >= 0 && deadline.status !== 'Done';
  const isOverdue = daysLeft < 0 && deadline.status !== 'Done';

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isUrgent && styles.cardUrgent,
        isOverdue && styles.cardOverdue,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.typeTag}>
          <Text style={styles.typeText}>{deadline.type}</Text>
        </View>
        <TouchableOpacity style={styles.statusToggle} onPress={onToggleStatus}>
          <Ionicons
            name={deadline.status === 'Done' ? 'checkmark-circle' : 'ellipse-outline'}
            size={24}
            color={deadline.status === 'Done' ? Colors.accent : Colors.textMuted}
          />
        </TouchableOpacity>
      </View>

      <Text style={[styles.title, deadline.status === 'Done' && styles.titleDone]}>
        {deadline.title}
      </Text>
      <Text style={styles.subject}>{deadline.subject.toUpperCase()}</Text>

      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Ionicons name="calendar-outline" size={14} color={Colors.textSecondary} />
          <Text style={styles.footerText}>
            {isOverdue
              ? 'Overdue'
              : daysLeft === 0
              ? 'Today'
              : daysLeft === 1
              ? 'Tomorrow'
              : `${daysLeft} days left`}
          </Text>
        </View>
        <View style={styles.footerItem}>
          <Ionicons
            name="flag"
            size={14}
            color={
              deadline.priority === 'High'
                ? Colors.danger
                : deadline.priority === 'Medium'
                ? Colors.warning
                : Colors.accent
            }
          />
          <Text style={styles.footerText}>{deadline.priority}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardUrgent: {
    borderColor: Colors.danger,
    backgroundColor: Colors.danger + '10', // slightly tinted
  },
  cardOverdue: {
    borderColor: Colors.warning,
    backgroundColor: Colors.warning + '10',
    opacity: 0.8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeTag: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
  },
  statusToggle: {
    padding: 4,
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: Colors.textMuted,
  },
  subject: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.primary,
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
});

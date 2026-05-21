import React from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { Check, Clock, Trash2, ChevronRight } from 'lucide-react-native';
import { Task } from '../types';
import { Colors } from '../constants/Colors';
import { useColorScheme } from './useColorScheme';
import { Link } from 'expo-router';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const priorityColor = colors.priority[task.priority];

  // Format date if exists
  const formattedDate = task.dueDate 
    ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.priorityIndicator, { backgroundColor: priorityColor }]} />
      
      <Pressable 
        style={[styles.checkbox, task.completed && { backgroundColor: colors.success, borderColor: colors.success }]} 
        onPress={() => onToggle(task.id)}
      >
        {task.completed && <Check size={16} color="#fff" />}
      </Pressable>

      <View style={styles.content}>
        <Link href={`/task/${task.id}`} asChild>
          <Pressable>
            <Text style={[
              styles.title, 
              { color: colors.text },
              task.completed && [styles.completedText, { color: colors.textSecondary }]
            ]} numberOfLines={1}>
              {task.title}
            </Text>
            {task.description && (
              <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={1}>
                {task.description}
              </Text>
            )}
            
            {formattedDate && (
              <View style={styles.footer}>
                <Clock size={12} color={colors.textSecondary} />
                <Text style={[styles.dateText, { color: colors.textSecondary }]}>{formattedDate}</Text>
              </View>
            )}
          </Pressable>
        </Link>
      </View>

      <Pressable onPress={() => onDelete(task.id)} style={styles.deleteButton}>
        <Trash2 size={18} color={colors.danger} opacity={0.7} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  priorityIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
  },
  description: {
    fontSize: 13,
    marginBottom: 6,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  dateText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
});

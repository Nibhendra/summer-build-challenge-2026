import React from 'react';
import { View, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Calendar, Tag, CheckCircle2, Circle, Trash2 } from 'lucide-react-native';

import { Text } from '@/components/Themed';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useTasks } from '@/hooks/useTasks';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tasks, toggleTaskStatus, deleteTask } = useTasks();
  
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const task = tasks.find(t => t.id === id);

  if (!task) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textSecondary }}>Task not found</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            deleteTask(task.id);
            router.back();
          }
        }
      ]
    );
  };

  const formattedDate = task.dueDate 
    ? new Date(task.dueDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    : 'No due date';

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.header}>
          <Pressable 
            style={styles.statusButton} 
            onPress={() => toggleTaskStatus(task.id)}
          >
            {task.completed ? (
              <CheckCircle2 size={32} color={colors.success} />
            ) : (
              <Circle size={32} color={colors.textSecondary} />
            )}
          </Pressable>
          
          <View style={styles.headerActions}>
            <Pressable onPress={() => router.push(`/add?id=${task.id}`)} style={styles.actionButton}>
              <Text style={{ color: colors.tint, fontWeight: '600', fontSize: 16 }}>Edit</Text>
            </Pressable>
            <Pressable onPress={handleDelete} style={styles.actionButton}>
              <Trash2 size={24} color={colors.danger} opacity={0.8} />
            </Pressable>
          </View>
        </View>

        <Text style={[
          styles.title, 
          { color: colors.text },
          task.completed && { color: colors.textSecondary, textDecorationLine: 'line-through' }
        ]}>
          {task.title}
        </Text>

        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Tag size={18} color={colors.priority[task.priority]} />
            <Text style={[styles.metaText, { color: colors.priority[task.priority] }]}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
            </Text>
          </View>
          
          <View style={styles.metaItem}>
            <Calendar size={18} color={colors.textSecondary} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>
              {formattedDate}
            </Text>
          </View>
        </View>

        {task.description ? (
          <View style={[styles.descriptionContainer, { borderTopColor: colors.border }]}>
            <Text style={[styles.descriptionLabel, { color: colors.textSecondary }]}>Description</Text>
            <Text style={[styles.descriptionText, { color: colors.text }]}>
              {task.description}
            </Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionButton: {
    padding: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    lineHeight: 34,
  },
  metaContainer: {
    gap: 16,
    marginBottom: 24,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaText: {
    fontSize: 16,
    fontWeight: '500',
  },
  descriptionContainer: {
    borderTopWidth: 1,
    paddingTop: 24,
  },
  descriptionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
  },
});

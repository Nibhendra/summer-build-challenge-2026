import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ListTodo } from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { useColorScheme } from './useColorScheme';

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = "No tasks found" }: EmptyStateProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: colors.border }]}>
        <ListTodo size={48} color={colors.textSecondary} />
      </View>
      <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 32,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

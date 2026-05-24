import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

interface EmptyStateProps {
  type: 'no-notes' | 'no-results';
  query?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type, query }) => {
  const isNoNotes = type === 'no-notes';

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Ionicons
          name={isNoNotes ? 'journal-outline' : 'search-outline'}
          size={56}
          color={Colors.primary}
          style={styles.icon}
        />
      </View>
      <Text style={styles.title}>
        {isNoNotes ? 'No notes yet' : 'No results found'}
      </Text>
      <Text style={styles.subtitle}>
        {isNoNotes
          ? 'Tap the + button to create your first note.'
          : `No notes match "${query}". Try a different search or filter.`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
    gap: 12,
  },
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary + '18',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  icon: {},
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
  },
});

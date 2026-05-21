import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Colors } from '../constants/Colors';
import { useColorScheme } from './useColorScheme';

export type FilterOption = 'All' | 'Today' | 'Upcoming' | 'Completed';

interface FilterTabsProps {
  currentFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
}

export function FilterTabs({ currentFilter, onFilterChange }: FilterTabsProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const filters: FilterOption[] = ['All', 'Today', 'Upcoming', 'Completed'];

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {filters.map((filter) => {
          const isActive = currentFilter === filter;
          return (
            <Pressable
              key={filter}
              onPress={() => onFilterChange(filter)}
              style={[
                styles.tab,
                { backgroundColor: isActive ? colors.tint : colors.card, borderColor: isActive ? colors.tint : colors.border }
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: isActive ? '#fff' : colors.textSecondary }
                ]}
              >
                {filter}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

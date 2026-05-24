import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SUBJECTS } from '../constants/Subjects';
import { TagChip } from './TagChip';

interface TagFilterProps {
  activeSubject: string;
  onSelectSubject: (key: string) => void;
}

export const TagFilter: React.FC<TagFilterProps> = ({ activeSubject, onSelectSubject }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      style={styles.scroll}
    >
      {SUBJECTS.map((subject) => (
        <TagChip
          key={subject.key}
          label={subject.label}
          color={subject.color}
          icon={subject.icon}
          selected={activeSubject === subject.key}
          onPress={() => onSelectSubject(subject.key)}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

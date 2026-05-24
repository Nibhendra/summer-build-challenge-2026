import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

interface TagChipProps {
  label: string;
  color: string;
  icon?: string;
  selected?: boolean;
  onPress?: () => void;
  size?: 'sm' | 'md';
}

export const TagChip: React.FC<TagChipProps> = ({
  label,
  color,
  icon,
  selected = false,
  onPress,
  size = 'md',
}) => {
  const bgColor = selected ? color : color + '20';
  const textColor = selected ? Colors.white : color;
  const borderColor = selected ? color : color + '40';

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.chip,
        size === 'sm' && styles.chipSm,
        { backgroundColor: bgColor, borderColor },
      ]}
    >
      {icon && (
        <Ionicons
          name={icon as any}
          size={size === 'sm' ? 11 : 13}
          color={textColor}
        />
      )}
      <Text style={[styles.label, size === 'sm' && styles.labelSm, { color: textColor }]}>
        {label}
      </Text>
    </Container>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  chipSm: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  labelSm: {
    fontSize: 10,
  },
});

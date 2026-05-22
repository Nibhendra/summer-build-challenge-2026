import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface Props {
  message: string;
  icon?: string;
  subtitle?: string;
}

export default function EmptyState({ message, icon = '📭', subtitle }: Props) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
      {subtitle ? <Text style={[styles.subtitle, { color: colors.textMuted }]}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: 32 },
  icon:    { fontSize: 48, marginBottom: 16 },
  message: { fontSize: 17, fontWeight: '600', textAlign: 'center', marginBottom: 8 },
  subtitle:{ fontSize: 13, textAlign: 'center', lineHeight: 20 },
});

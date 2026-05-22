import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

interface Props {
  label: string;
  value: string;
  subValue?: string;
  icon?: string;
  gradient?: [string, string];
  accentColor?: string;
  fullWidth?: boolean;
}

export default function StatCard({ label, value, subValue, icon, gradient, accentColor, fullWidth }: Props) {
  const { colors } = useTheme();
  const accent = accentColor ?? colors.primary;
  const bg = gradient ?? [accent + '30', accent + '10'] as [string, string];

  const isSolid = !!gradient;
  const valColor = isSolid ? '#FFFFFF' : accent;
  const labColor = isSolid ? 'rgba(255, 255, 255, 0.8)' : colors.textSecondary;
  const iconBg = isSolid ? 'rgba(255, 255, 255, 0.2)' : accent + '30';

  return (
    <LinearGradient
      colors={bg}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, fullWidth && styles.fullWidth, { borderColor: isSolid ? 'transparent' : colors.borderLight }]}
    >
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={[styles.value, { color: valColor }]} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
      <Text style={[styles.label, { color: labColor }]} numberOfLines={1}>{label}</Text>
      {subValue ? <Text style={[styles.subValue, { color: labColor }]} numberOfLines={1}>{subValue}</Text> : null}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 20, padding: 16, width: '48%', borderWidth: 1 },
  fullWidth: { width: '100%' },
  iconWrap: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  icon: { fontSize: 20 },
  value: { fontSize: 20, fontWeight: '800', marginBottom: 2 },
  label: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  subValue: { fontSize: 11, marginTop: 2 },
});

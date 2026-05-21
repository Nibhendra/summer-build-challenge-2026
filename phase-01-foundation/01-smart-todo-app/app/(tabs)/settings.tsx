import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Info, LayoutTemplate, Smartphone } from 'lucide-react-native';

import { Text } from '@/components/Themed';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function SettingsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.header}>
          <LayoutTemplate size={32} color={colors.tint} />
          <Text style={[styles.title, { color: colors.text }]}>Smart To-Do</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Summer Build Challenge 2026
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>About This App</Text>
          <Text style={[styles.description, { color: colors.text }]}>
            Phase 01 Foundation app focusing on React Native, Expo Router, and AsyncStorage. 
            Features a mobile-first polished UI with functional task management.
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Tech Stack</Text>
          <View style={styles.stackList}>
            <View style={styles.stackItem}>
              <Smartphone size={20} color={colors.textSecondary} />
              <Text style={[styles.stackText, { color: colors.text }]}>React Native & Expo</Text>
            </View>
            <View style={styles.stackItem}>
              <LayoutTemplate size={20} color={colors.textSecondary} />
              <Text style={[styles.stackText, { color: colors.text }]}>Expo Router</Text>
            </View>
            <View style={styles.stackItem}>
              <Info size={20} color={colors.textSecondary} />
              <Text style={[styles.stackText, { color: colors.text }]}>AsyncStorage</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  divider: {
    height: 1,
    marginVertical: 24,
  },
  stackList: {
    gap: 16,
  },
  stackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stackText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

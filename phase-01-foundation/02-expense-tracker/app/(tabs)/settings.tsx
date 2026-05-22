import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, Switch, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { useExpenses } from '../../hooks/useExpenses';
import { formatCurrency } from '../../utils/formatting';
import { useTheme } from '../../context/ThemeContext';

export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { expenses, settings, reload, clearAll, updateSettings } = useExpenses();
  const [budgetInput, setBudgetInput] = useState(String(settings.monthlyBudget));
  const [saved, setSaved] = useState(false);

  useFocusEffect(useCallback(() => {
    reload();
    setBudgetInput(String(settings.monthlyBudget));
  }, [reload, settings.monthlyBudget]));

  const handleSaveBudget = async () => {
    const val = parseFloat(budgetInput);
    if (isNaN(val) || val < 0) {
      Alert.alert('Invalid Budget', 'Please enter a valid positive number.');
      return;
    }
    await updateSettings({ ...settings, monthlyBudget: val });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your expenses. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All', style: 'destructive',
          onPress: async () => {
            await clearAll();
            Alert.alert('Done', 'All expense data has been cleared.');
          },
        },
      ]
    );
  };

  const handleExport = async () => {
    if (expenses.length === 0) {
      Alert.alert('No Data', 'There are no expenses to export.');
      return;
    }
    try {
      const json = JSON.stringify(expenses, null, 2);
      const path = FileSystem.documentDirectory + 'mypocket_export.json';
      await FileSystem.writeAsStringAsync(path, json, { encoding: FileSystem.EncodingType.UTF8 });
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(path, { mimeType: 'application/json', dialogTitle: 'Export MyPocket Data' });
      } else {
        Alert.alert('Exported', `File saved to:\n${path}`);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to export data.');
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── App Hero ──────────────────────────────────────── */}
        <LinearGradient
          colors={colors.gradientHero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.decorCircle} />
          <View style={styles.heroIcon}>
            <Text style={styles.heroIconText}>₹</Text>
          </View>
          <Text style={styles.heroTitle}>MyPocket</Text>
          <Text style={styles.heroSub}>UPI Expense Tracker</Text>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>App #02 · Summer Build Challenge 2026</Text>
          </View>
        </LinearGradient>

        {/* ── Stats Row ─────────────────────────────────────── */}
        <View style={[styles.statsRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statVal, { color: colors.primary }]}>{expenses.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Expenses</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statVal, { color: colors.accent }]}>
              {formatCurrency(expenses.reduce((s, e) => s + e.amount, 0))}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Spent</Text>
          </View>
        </View>

        {/* ── Appearance (Theme Toggle) ──────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>🎨 Appearance</Text>
        </View>
        <View style={[styles.settingRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>{isDark ? '🌙' : '☀️'}</Text>
            <View>
              <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
                {isDark ? 'Dark Mode' : 'Light Mode'}
              </Text>
              <Text style={[styles.settingDesc, { color: colors.textMuted }]}>
                {isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              </Text>
            </View>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.primary + '88' }}
            thumbColor={isDark ? colors.primary : colors.textMuted}
          />
        </View>

        {/* ── Budget ────────────────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>💰 Monthly Budget</Text>
          <Text style={[styles.sectionDesc, { color: colors.textSecondary }]}>
            Set a limit to get warnings in Analytics
          </Text>
        </View>
        <View style={styles.budgetRow}>
          <View style={[styles.budgetInputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.rupeeSign, { color: colors.textSecondary }]}>₹</Text>
            <TextInput
              style={[styles.budgetInput, { color: colors.textPrimary }]}
              value={budgetInput}
              onChangeText={setBudgetInput}
              keyboardType="numeric"
              placeholder="e.g. 10000"
              placeholderTextColor={colors.textMuted}
              returnKeyType="done"
              onSubmitEditing={handleSaveBudget}
            />
          </View>
          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: saved ? colors.success : colors.primary }]}
            onPress={handleSaveBudget}
          >
            <Text style={styles.saveBtnText}>{saved ? '✓ Saved' : 'Save'}</Text>
          </TouchableOpacity>
        </View>

        {/* ── Data Management ───────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>📁 Data</Text>
        </View>

        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={handleExport}
        >
          <View style={styles.actionLeft}>
            <Text style={styles.actionIcon}>📤</Text>
            <View>
              <Text style={[styles.actionTitle, { color: colors.textPrimary }]}>Export as JSON</Text>
              <Text style={[styles.actionDesc, { color: colors.textMuted }]}>Share your data as a file</Text>
            </View>
          </View>
          <Text style={[styles.chevron, { color: colors.textMuted }]}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: colors.card, borderColor: colors.danger + '44' }]}
          onPress={handleClearAll}
        >
          <View style={styles.actionLeft}>
            <Text style={styles.actionIcon}>🗑️</Text>
            <View>
              <Text style={[styles.actionTitle, { color: colors.danger }]}>Clear All Data</Text>
              <Text style={[styles.actionDesc, { color: colors.textMuted }]}>Permanently delete all expenses</Text>
            </View>
          </View>
          <Text style={[styles.chevron, { color: colors.textMuted }]}>›</Text>
        </TouchableOpacity>

        {/* ── About ─────────────────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>ℹ️ About</Text>
        </View>
        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {[
            ['App Name',   'MyPocket UPI Tracker'],
            ['Version',    '1.0.0'],
            ['Challenge',  'Summer Build 2026'],
            ['Stack',      'React Native · Expo'],
            ['Storage',    'AsyncStorage (Local)'],
          ].map(([label, value], i, arr) => (
            <View key={label} style={[
              styles.infoRow,
              { borderBottomColor: colors.border },
              i === arr.length - 1 && { borderBottomWidth: 0 },
            ]}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{label}</Text>
              <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{value}</Text>
            </View>
          ))}
        </View>

        {/* ── Future Upgrades ───────────────────────────────── */}
        <View style={[styles.futureCard, { backgroundColor: colors.accent + '15', borderColor: colors.accent + '33' }]}>
          <Text style={[styles.futureTitle, { color: colors.accent }]}>🚀 Future Upgrades</Text>
          {[
            '• SMS-based auto-import from bank messages',
            '• Paytm / PhonePe API integration',
            '• Bank statement PDF import',
            '• Cloud backup & multi-device sync',
            '• UPI QR scanner for instant logging',
          ].map(item => (
            <Text key={item} style={[styles.futureItem, { color: colors.textSecondary }]}>{item}</Text>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1 },
  content: { paddingBottom: 50 },

  // Hero
  hero: {
    alignItems: 'center',
    paddingVertical: 36,
    paddingHorizontal: 24,
    marginBottom: 20,
    overflow: 'hidden',
  },
  decorCircle: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.08)', top: -60, right: -60,
  },
  heroIcon: {
    width: 76, height: 76, borderRadius: 26,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  heroIconText:  { color: '#fff', fontSize: 38, fontWeight: '900' },
  heroTitle:     { color: '#fff', fontSize: 28, fontWeight: '900', marginBottom: 4 },
  heroSub:       { color: 'rgba(255,255,255,0.75)', fontSize: 14, marginBottom: 12 },
  heroBadge: {
    backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 5,
  },
  heroBadgeText: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '600' },

  // Stats
  statsRow: {
    flexDirection: 'row', borderRadius: 16, padding: 20,
    marginHorizontal: 20, marginBottom: 24,
    borderWidth: 1,
  },
  statItem:   { flex: 1, alignItems: 'center' },
  statVal:    { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  statLabel:  { fontSize: 12 },
  statDivider:{ width: 1, marginHorizontal: 16 },

  // Section headers
  sectionHeader: { paddingHorizontal: 20, marginBottom: 10 },
  sectionTitle:  { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  sectionDesc:   { fontSize: 13 },

  // Theme toggle row
  settingRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginHorizontal: 20, marginBottom: 20, borderRadius: 16,
    padding: 16, borderWidth: 1,
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  settingIcon: { fontSize: 24 },
  settingLabel:{ fontSize: 15, fontWeight: '700', marginBottom: 2 },
  settingDesc: { fontSize: 12 },

  // Budget
  budgetRow:      { flexDirection: 'row', gap: 10, alignItems: 'center', marginHorizontal: 20, marginBottom: 20 },
  budgetInputWrap:{ flex: 1, flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 1, paddingHorizontal: 12 },
  rupeeSign:      { fontSize: 18, marginRight: 6 },
  budgetInput:    { flex: 1, fontSize: 18, fontWeight: '700', paddingVertical: 12 },
  saveBtn:        { borderRadius: 12, paddingHorizontal: 18, paddingVertical: 14 },
  saveBtnText:    { color: '#fff', fontWeight: '700', fontSize: 14 },

  // Action buttons
  actionBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderRadius: 14, padding: 16, marginHorizontal: 20, marginBottom: 10, borderWidth: 1,
  },
  actionLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  actionIcon: { fontSize: 22 },
  actionTitle:{ fontSize: 14, fontWeight: '700', marginBottom: 2 },
  actionDesc: { fontSize: 12 },
  chevron:    { fontSize: 20 },

  // Info card
  infoCard: { borderRadius: 14, borderWidth: 1, overflow: 'hidden', marginHorizontal: 20, marginBottom: 20 },
  infoRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  infoLabel:{ fontSize: 13 },
  infoValue:{ fontSize: 13, fontWeight: '600', maxWidth: '60%', textAlign: 'right' },

  // Future card
  futureCard: { borderRadius: 14, borderWidth: 1, padding: 16, marginHorizontal: 20, marginBottom: 20 },
  futureTitle:{ fontSize: 14, fontWeight: '700', marginBottom: 10 },
  futureItem: { fontSize: 13, marginBottom: 5, lineHeight: 20 },
});

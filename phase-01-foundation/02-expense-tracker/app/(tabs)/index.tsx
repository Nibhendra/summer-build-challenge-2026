import React, { useCallback, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  RefreshControl, ActivityIndicator,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useExpenses } from '../../hooks/useExpenses';
import {
  getTodayExpenses, getMonthExpenses, sumAmount, formatCurrency,
} from '../../utils/formatting';
import StatCard from '../../components/StatCard';
import ExpenseCard from '../../components/ExpenseCard';
import EmptyState from '../../components/EmptyState';
import FloatingAddButton from '../../components/FloatingAddButton';

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { expenses, loading, reload, deleteExpense } = useExpenses();
  const [quote, setQuote] = useState('');

  useFocusEffect(useCallback(() => { 
    reload(); 
    setQuote(getRandomQuote());
  }, [reload]));

  const todayExp   = getTodayExpenses(expenses);
  const monthExp   = getMonthExpenses(expenses);
  const todayTotal = sumAmount(todayExp);
  const monthTotal = sumAmount(monthExp);
  const cashTotal  = sumAmount(expenses.filter(e => e.paymentMode === 'Cash'));
  const upiTotal   = sumAmount(expenses.filter(e => e.paymentMode === 'UPI'));
  const latest5    = expenses.slice(0, 5);
  const todayPct   = monthTotal > 0 ? Math.min((todayTotal / monthTotal) * 100, 100) : 0;

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} tintColor={colors.primary} />}
      >

        {/* ── Header ─────────────────────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.headerTextWrap}>
            <Text style={[styles.greeting, { color: colors.textPrimary }]}>Thought of the day 💡</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={2}>"{quote}"</Text>
          </View>
        </View>

        {/* ── Hero Gradient Card ─────────────────────────────── */}
        <LinearGradient
          colors={colors.gradientHero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.heroCard, { shadowColor: colors.primary }]}
        >
          {/* Decorative circles */}
          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />

          <Text style={styles.heroLabel}>THIS MONTH</Text>
          <Text style={styles.heroAmount}>{formatCurrency(monthTotal)}</Text>

          <View style={styles.heroRow}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatLabel}>Today</Text>
              <Text style={styles.heroStatValue}>{formatCurrency(todayTotal)}</Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatLabel}>Transactions</Text>
              <Text style={styles.heroStatValue}>{monthExp.length}</Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatLabel}>Today's %</Text>
              <Text style={styles.heroStatValue}>{todayPct.toFixed(0)}%</Text>
            </View>
          </View>

          {/* Progress bar */}
          <View style={styles.heroProgressBg}>
            <View style={[styles.heroProgressFill, { width: `${todayPct}%` as any }]} />
          </View>
          <Text style={styles.heroProgressLabel}>Today vs Month ratio</Text>
        </LinearGradient>

        {/* ── Stat Cards Grid ────────────────────────────────── */}
        <View style={styles.statGrid}>
          <StatCard
            label="Today"
            value={formatCurrency(todayTotal)}
            icon="🌅"
            gradient={colors.gradientOrange}
            accentColor={colors.gradientOrange[0]}
          />
          <StatCard
            label="Month"
            value={formatCurrency(monthTotal)}
            icon="📆"
            gradient={colors.gradientPurple}
            accentColor={colors.primaryLight}
          />
          <StatCard
            label="Cash"
            value={formatCurrency(cashTotal)}
            icon="💵"
            gradient={colors.gradientGreen}
            accentColor={colors.accent}
          />
          <StatCard
            label="UPI"
            value={formatCurrency(upiTotal)}
            icon="📱"
            gradient={colors.gradientBlue}
            accentColor={colors.info}
          />
        </View>

        {/* ── Recent Expenses ────────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Recent Expenses</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/expenses')}>
            <Text style={[styles.seeAll, { color: colors.primaryLight }]}>See all →</Text>
          </TouchableOpacity>
        </View>

        {latest5.length === 0 ? (
          <EmptyState
            icon="🧾"
            message="No expenses yet"
            subtitle="Tap + to add your first expense"
          />
        ) : (
          latest5.map(expense => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onDelete={deleteExpense}
              onEdit={(e) => router.push({ pathname: '/edit-expense', params: { id: e.id } })}
            />
          ))
        )}
      </ScrollView>

      {/* ── FAB ──────────────────────────────────────────────── */}
      <FloatingAddButton />
    </SafeAreaView>
  );
}

const QUOTES = [
  "A penny saved is a penny earned.",
  "Beware of little expenses; a small leak will sink a great ship.",
  "Do not save what is left after spending, but spend what is left after saving.",
  "Wealth consists not in having great possessions, but in having few wants.",
  "The art is not in making money, but in keeping it.",
  "He who buys what he does not need, steals from himself.",
  "Every time you borrow money, you're robbing your future self.",
  "Financial freedom is available to those who learn about it and work for it.",
  "Money is a terrible master but an excellent servant.",
  "Don't tell me where your priorities are. Show me where you spend your money."
];

function getRandomQuote(): string {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 110 },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTextWrap: {
    flex: 1,
    paddingRight: 10,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: { 
    fontSize: 13, 
    marginTop: 4,
    fontStyle: 'italic',
    lineHeight: 18,
  },

  // ── Hero Card
  heroCard: {
    borderRadius: 24,
    padding: 22,
    marginBottom: 16,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 10,
  },
  decorCircle1: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.07)',
    top: -60,
    right: -40,
  },
  decorCircle2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.07)',
    bottom: -20,
    left: 20,
  },
  heroLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  heroAmount: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '900',
    marginBottom: 18,
    letterSpacing: -1,
  },
  heroRow: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 14,
    padding: 12,
  },
  heroStat: { flex: 1, alignItems: 'center' },
  heroStatLabel: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 3,
  },
  heroStatValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  heroDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 4,
  },
  heroProgressBg: {
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 5,
  },
  heroProgressFill: {
    height: 5,
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  heroProgressLabel: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 10,
  },

  // ── Stat Grid (2x2)
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },

  // ── Section header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  seeAll: { fontSize: 13, fontWeight: '600' },
});

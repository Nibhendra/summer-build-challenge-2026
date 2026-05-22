import React, { useCallback, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { useTheme } from '../../context/ThemeContext';
import { useExpenses } from '../../hooks/useExpenses';
import EmptyState from '../../components/EmptyState';
import {
  getMonthExpenses, sumAmount, formatCurrency,
  getLastNDays, getDailyTotals, formatDayOfWeek,
} from '../../utils/formatting';
import { CATEGORY_COLORS } from '../../constants/categories';
import { Category } from '../../types/expense';

const SCREEN_W = Dimensions.get('window').width;
const CHART_W = SCREEN_W - 40 - 36;

export default function AnalyticsScreen() {
  const { colors } = useTheme();
  const { expenses, settings, loading, reload } = useExpenses();
  useFocusEffect(useCallback(() => { reload(); }, [reload]));

  const monthExp = useMemo(() => getMonthExpenses(expenses), [expenses]);
  const monthTotal = sumAmount(monthExp);
  const budget = settings.monthlyBudget;
  const budgetPct = budget > 0 ? Math.min((monthTotal / budget) * 100, 100) : 0;
  const overBudget = monthTotal > budget && budget > 0;

  const upiTotal   = sumAmount(monthExp.filter(e => e.paymentMode === 'UPI'));
  const cashTotal  = sumAmount(monthExp.filter(e => e.paymentMode === 'Cash'));
  const cardTotal  = sumAmount(monthExp.filter(e => e.paymentMode === 'Card'));
  const otherTotal = sumAmount(monthExp.filter(e => e.paymentMode === 'Other'));

  const catTotals = useMemo(() => {
    const map: Partial<Record<Category, number>> = {};
    monthExp.forEach(e => {
      map[e.category] = (map[e.category] ?? 0) + e.amount;
    });
    return Object.entries(map)
      .map(([cat, amount]) => ({ cat: cat as Category, amount: amount as number }))
      .sort((a, b) => b.amount - a.amount);
  }, [monthExp]);

  const days7 = useMemo(() => getLastNDays(7), []);
  const dailyTotals = useMemo(() => getDailyTotals(expenses, days7), [expenses, days7]);
  const dayLabels = useMemo(() => days7.map(d => formatDayOfWeek(d)), [days7]);

  const pieData = [
    { name: 'UPI',   amount: upiTotal,   color: colors.upi,     legendFontColor: colors.textSecondary, legendFontSize: 11 },
    { name: 'Cash',  amount: cashTotal,  color: colors.cash,    legendFontColor: colors.textSecondary, legendFontSize: 11 },
    { name: 'Card',  amount: cardTotal,  color: colors.payCard, legendFontColor: colors.textSecondary, legendFontSize: 11 },
    { name: 'Other', amount: otherTotal, color: colors.other,   legendFontColor: colors.textSecondary, legendFontSize: 11 },
  ].filter(d => d.amount > 0);

  const chartConfig = {
    backgroundGradientFrom: colors.cardElevated,
    backgroundGradientTo: colors.cardElevated,
    color: (opacity = 1) => `rgba(108, 99, 255, ${opacity})`,
    labelColor: () => colors.textSecondary,
    propsForBackgroundLines: { stroke: colors.border },
    decimalPlaces: 0,
    barPercentage: 0.55,
    propsForLabels: { fontSize: 10 },
  };

  const safeBarData = dailyTotals.map(v => (isNaN(v) || !isFinite(v) ? 0 : v));
  const hasBarData = safeBarData.some(v => v > 0);

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (monthExp.length === 0) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['left', 'right']}>
        <EmptyState icon="📊" message="No data for this month" subtitle="Start adding expenses to see analytics" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Budget Bar ───────────────────────────────── */}
        {budget > 0 && (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: overBudget ? colors.danger + '55' : colors.borderLight }]}>
            <View style={styles.row}>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                {overBudget ? '⚠️ Over Budget!' : '📊 Monthly Budget'}
              </Text>
              <Text style={[styles.pctText, { color: overBudget ? colors.danger : colors.accent }]}>
                {budgetPct.toFixed(0)}%
              </Text>
            </View>
            <View style={[styles.progressBg, { backgroundColor: colors.borderLight }]}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${budgetPct}%` as any, backgroundColor: overBudget ? colors.danger : colors.accent },
                ]}
              />
            </View>
            <View style={styles.row}>
              <Text style={[styles.muted, { color: colors.textSecondary }]}>Spent: {formatCurrency(monthTotal)}</Text>
              <Text style={[styles.muted, { color: colors.textSecondary }]}>Budget: {formatCurrency(budget)}</Text>
            </View>
          </View>
        )}

        {/* ── Highest Spending ─────────────────────────── */}
        {catTotals.length > 0 && (
          <View style={[styles.highlightCard, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '33' }]}>
            <Text style={[styles.highlightLabel, { color: colors.textSecondary }]}>🏆 Highest Spending</Text>
            <Text style={[styles.highlightCat, { color: colors.primary }]}>{catTotals[0].cat}</Text>
            <Text style={[styles.highlightAmt, { color: colors.primary }]}>{formatCurrency(catTotals[0].amount)}</Text>
          </View>
        )}

        {/* ── Payment Mode Pie Chart ────────────────────── */}
        {pieData.length >= 2 && (
          <View style={[styles.card, { backgroundColor: colors.cardElevated, borderColor: colors.borderLight }]}>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Payment Mode Breakdown</Text>
            <PieChart
              data={pieData}
              width={CHART_W}
              height={180}
              chartConfig={chartConfig}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="10"
              absolute={false}
            />
          </View>
        )}

        {/* Single mode info (when only 1 payment mode used) */}
        {pieData.length === 1 && (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.borderLight }]}>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Payment Mode</Text>
            <View style={styles.singleModeRow}>
              <View style={[styles.modeDot, { backgroundColor: pieData[0].color }]} />
              <Text style={[styles.modeName, { color: colors.textPrimary }]}>{pieData[0].name}</Text>
              <Text style={[styles.modeAmt, { color: colors.textPrimary }]}>{formatCurrency(pieData[0].amount)}</Text>
            </View>
          </View>
        )}

        {/* ── Daily Bar Chart ───────────────────────────── */}
        {hasBarData && (
          <View style={[styles.card, { backgroundColor: colors.cardElevated, borderColor: colors.borderLight }]}>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Daily Spending (Last 7 Days)</Text>
            <BarChart
              data={{ labels: dayLabels, datasets: [{ data: safeBarData }] }}
              width={CHART_W}
              height={200}
              chartConfig={chartConfig}
              style={styles.chart}
              showValuesOnTopOfBars={false}
              withInnerLines
              yAxisLabel="₹"
              yAxisSuffix=""
              fromZero
            />
          </View>
        )}

        {/* ── Category Breakdown ───────────────────────── */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.borderLight }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Category Breakdown</Text>
          {catTotals.map(({ cat, amount }) => {
            const pct = monthTotal > 0 ? (amount / monthTotal) * 100 : 0;
            const color = CATEGORY_COLORS(colors)[cat];
            return (
              <View key={cat} style={styles.catItem}>
                <View style={styles.catLabelRow}>
                  <View style={[styles.catDot, { backgroundColor: color }]} />
                  <Text style={[styles.catName, { color: colors.textPrimary }]}>{cat}</Text>
                  <Text style={[styles.catAmt, { color: colors.textPrimary }]}>{formatCurrency(amount)}</Text>
                  <Text style={[styles.catPct, { color: colors.textMuted }]}>{pct.toFixed(0)}%</Text>
                </View>
                <View style={[styles.catBarBg, { backgroundColor: colors.borderLight }]}>
                  <View style={[styles.catBarFill, { width: `${pct}%` as any, backgroundColor: color }]} />
                </View>
              </View>
            );
          })}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1 },
  centered:{ flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 20, paddingBottom: 40 },

  card: { borderRadius: 20, padding: 18, marginBottom: 14, borderWidth: 1 },
  cardTitle: { fontSize: 15, fontWeight: '700', marginBottom: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  pctText: { fontSize: 15, fontWeight: '800' },
  progressBg: { height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: 8, borderRadius: 4 },
  muted: { fontSize: 12 },

  highlightCard: {
    borderRadius: 20, padding: 18, marginBottom: 14, borderWidth: 1,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  highlightLabel: { fontSize: 13, fontWeight: '600' },
  highlightCat:   { fontSize: 14, fontWeight: '700', flex: 1, textAlign: 'center', marginHorizontal: 8 },
  highlightAmt:   { fontSize: 17, fontWeight: '800' },

  chart: { borderRadius: 16, marginLeft: -10 },

  singleModeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  modeDot:  { width: 14, height: 14, borderRadius: 7 },
  modeName: { fontSize: 15, fontWeight: '600', flex: 1 },
  modeAmt:  { fontSize: 15, fontWeight: '700' },

  catItem: { marginBottom: 14 },
  catLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 6 },
  catDot:  { width: 10, height: 10, borderRadius: 5 },
  catName: { fontSize: 13, fontWeight: '600', flex: 1 },
  catAmt:  { fontSize: 12, fontWeight: '700' },
  catPct:  { fontSize: 11, minWidth: 32, textAlign: 'right' },
  catBarBg: { height: 5, borderRadius: 3, overflow: 'hidden' },
  catBarFill: { height: 5, borderRadius: 3 },
});

import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ScrollView, ActivityIndicator,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useExpenses } from '../../hooks/useExpenses';
import { CATEGORIES } from '../../constants/categories';
import { PAYMENT_MODES } from '../../constants/paymentModes';
import { Category, PaymentMode } from '../../types/expense';
import ExpenseCard from '../../components/ExpenseCard';
import EmptyState from '../../components/EmptyState';
import FloatingAddButton from '../../components/FloatingAddButton';
import { formatCurrency, sumAmount } from '../../utils/formatting';
import { useTheme } from '../../context/ThemeContext';

type FilterMode = 'All' | PaymentMode;
type FilterCat  = 'All' | Category;

export default function ExpensesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { expenses, loading, reload, deleteExpense } = useExpenses();
  const [filterMode, setFilterMode] = useState<FilterMode>('All');
  const [filterCat, setFilterCat]   = useState<FilterCat>('All');
  const [sortDesc, setSortDesc]      = useState(true);

  useFocusEffect(useCallback(() => { reload(); }, [reload]));

  const filtered = expenses
    .filter(e => filterMode === 'All' || e.paymentMode === filterMode)
    .filter(e => filterCat  === 'All' || e.category   === filterCat)
    .sort((a, b) => sortDesc
      ? new Date(b.date).getTime() - new Date(a.date).getTime()
      : new Date(a.date).getTime() - new Date(b.date).getTime()
    );

  const total = sumAmount(filtered);

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['left', 'right']}>
      {/* Filter bar — payment modes */}
      <View style={[styles.filterSection, { backgroundColor: colors.surface }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {(['All', ...PAYMENT_MODES] as FilterMode[]).map(mode => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.chip,
                { backgroundColor: colors.card, borderColor: colors.borderLight },
                filterMode === mode && { backgroundColor: colors.primary, borderColor: colors.primary },
              ]}
              onPress={() => setFilterMode(mode)}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: colors.textSecondary },
                  filterMode === mode && styles.chipTextActive,
                ]}
              >
                {mode}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Filter bar — categories */}
      <View style={[styles.filterSection, { backgroundColor: colors.surface }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {(['All', ...CATEGORIES] as FilterCat[]).map(cat => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.chip, styles.chipSm,
                { backgroundColor: colors.card, borderColor: colors.borderLight },
                filterCat === cat && { backgroundColor: colors.primary, borderColor: colors.primary },
              ]}
              onPress={() => setFilterCat(cat)}
            >
              <Text
                style={[
                  styles.chipText, styles.chipTextSm,
                  { color: colors.textSecondary },
                  filterCat === cat && styles.chipTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Summary bar */}
      <View style={[styles.summaryBar, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
          {filtered.length} expense{filtered.length !== 1 ? 's' : ''} · {formatCurrency(total)}
        </Text>
        <TouchableOpacity
          onPress={() => setSortDesc(p => !p)}
          style={[styles.sortBtn, { backgroundColor: colors.card }]}
        >
          <Text style={[styles.sortText, { color: colors.primary }]}>{sortDesc ? '↓ Newest' : '↑ Oldest'}</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="🔍"
            message="No expenses found"
            subtitle="Try changing your filters or add a new expense"
          />
        }
        renderItem={({ item }) => (
          <ExpenseCard
            expense={item}
            onDelete={deleteExpense}
            onEdit={(e) => router.push({ pathname: '/edit-expense', params: { id: e.id } })}
          />
        )}
      />

      {/* FAB */}
      <FloatingAddButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1 },
  centered:{ flex: 1, alignItems: 'center', justifyContent: 'center' },
  filterSection: { paddingVertical: 8 },
  filterRow: { paddingHorizontal: 16, gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 20, borderWidth: 1,
  },
  chipSm: { paddingHorizontal: 10, paddingVertical: 5 },
  chipText:   { fontSize: 13, fontWeight: '600' },
  chipTextSm: { fontSize: 11 },
  chipTextActive: { color: '#fff' },
  summaryBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 10, borderBottomWidth: 1,
  },
  summaryText: { fontSize: 13, fontWeight: '600' },
  sortBtn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  sortText: { fontSize: 12, fontWeight: '700' },
  list: { padding: 16, paddingBottom: 100 },
});

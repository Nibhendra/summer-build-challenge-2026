import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Expense } from '../types/expense';
import { CATEGORY_ICONS, CATEGORY_COLORS, CATEGORY_GRADIENTS } from '../constants/categories';
import { PAYMENT_MODE_COLORS } from '../constants/paymentModes';
import { formatCurrency, formatDate } from '../utils/formatting';
import { useTheme } from '../context/ThemeContext';

interface Props {
  expense: Expense;
  onDelete?: (id: string) => void;
  onEdit?: (expense: Expense) => void;
}

export default function ExpenseCard({ expense, onDelete, onEdit }: Props) {
  const { colors } = useTheme();
  const categoryColor = CATEGORY_COLORS(colors)[expense.category];
  const categoryGradient = CATEGORY_GRADIENTS[expense.category];
  const modeColor = PAYMENT_MODE_COLORS(colors)[expense.paymentMode];

  const handleDelete = () => {
    Alert.alert('Delete Expense', `Delete "${expense.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete?.(expense.id) },
    ]);
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.borderLight }]}>
      <LinearGradient
        colors={categoryGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.iconWrap}
      >
        <Text style={styles.icon}>{CATEGORY_ICONS[expense.category]}</Text>
      </LinearGradient>

      <View style={styles.details}>
        <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>
          {expense.title}
        </Text>
        <View style={styles.metaRow}>
          <View style={[styles.chip, { backgroundColor: categoryColor + '25', borderColor: categoryColor + '50' }]}>
            <Text style={[styles.chipText, { color: categoryColor }]}>{expense.category}</Text>
          </View>
          <View style={[styles.chip, { backgroundColor: modeColor + '25', borderColor: modeColor + '50' }]}>
            <Text style={[styles.chipText, { color: modeColor }]}>{expense.paymentMode}</Text>
          </View>
        </View>
        <Text style={[styles.date, { color: colors.textMuted }]}>{formatDate(expense.date)}</Text>
      </View>

      <View style={styles.right}>
        <Text style={[styles.amount, { color: colors.textPrimary }]}>
          {formatCurrency(expense.amount)}
        </Text>
        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity onPress={() => onEdit(expense)} style={styles.actionBtn}
              hitSlop={{ top: 10, bottom: 10, left: 8, right: 4 }}>
              <Text style={styles.actionIcon}>✏️</Text>
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity onPress={handleDelete} style={styles.actionBtn}
              hitSlop={{ top: 10, bottom: 10, left: 4, right: 8 }}>
              <Text style={styles.actionIcon}>🗑️</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: 10,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  iconWrap: {
    width: 48, height: 48, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  icon: { fontSize: 22 },
  details: { flex: 1 },
  title: { fontSize: 15, fontWeight: '700', marginBottom: 5 },
  metaRow: { flexDirection: 'row', gap: 6, marginBottom: 4, flexWrap: 'wrap' },
  chip: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20, borderWidth: 1 },
  chipText: { fontSize: 10, fontWeight: '700' },
  date: { fontSize: 11 },
  right: { alignItems: 'flex-end', justifyContent: 'space-between', paddingVertical: 2 },
  amount: { fontSize: 16, fontWeight: '800', marginBottom: 8 },
  actions: { flexDirection: 'row', gap: 6 },
  actionBtn: { padding: 2 },
  actionIcon: { fontSize: 14 },
});

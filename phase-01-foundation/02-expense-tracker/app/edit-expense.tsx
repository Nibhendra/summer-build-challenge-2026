import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { CATEGORIES, CATEGORY_ICONS } from '../constants/categories';
import { PAYMENT_MODES, UPI_APPS, UPI_APP_ICONS } from '../constants/paymentModes';
import { Category, PaymentMode, UpiApp, Expense } from '../types/expense';
import { updateExpense } from '../utils/storage';
import { useExpenses } from '../hooks/useExpenses';

export default function EditExpenseScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { expenses, reload } = useExpenses();
  const { colors } = useTheme();

  const [loading, setLoading] = useState(true);
  const [expense, setExpense] = useState<Expense | null>(null);

  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Food & Dining');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('UPI');
  const [upiApp, setUpiApp] = useState<UpiApp>('Paytm');
  const [date, setDate] = useState('');

  useEffect(() => {
    const found = expenses.find(e => e.id === id);
    if (found) {
      setExpense(found);
      setAmount(found.amount.toString());
      setTitle(found.title);
      setCategory(found.category);
      setPaymentMode(found.paymentMode);
      setUpiApp(found.upiApp || 'N/A');
      setDate(found.date);
    }
    setLoading(false);
  }, [id, expenses]);

  const handleSave = async () => {
    if (!expense) return;

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0.');
      return;
    }

    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a title or note for this expense.');
      return;
    }

    const updatedExpense: Expense = {
      ...expense,
      title: title.trim(),
      amount: parsedAmount,
      category,
      paymentMode,
      upiApp: paymentMode === 'UPI' ? upiApp : 'N/A',
      date,
    };

    try {
      await updateExpense(updatedExpense);
      await reload();
      router.back();
    } catch (e) {
      Alert.alert('Error', 'Failed to update expense. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!expense) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textPrimary }}>Expense not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Amount input */}
          <View style={[styles.amountContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.amountLabel, { color: colors.textSecondary }]}>AMOUNT</Text>
            <View style={styles.amountInputRow}>
              <Text style={[styles.currencySymbol, { color: colors.primary }]}>₹</Text>
              <TextInput
                style={[styles.amountInput, { color: colors.textPrimary }]}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </View>

          {/* Title/Note */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Title / Note</Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.card, color: colors.textPrimary, borderColor: colors.border }]}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Strepsils, Uber ride, Swiggy..."
              placeholderTextColor={colors.textMuted}
            />
          </View>

          {/* Date Selector */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Date</Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.card, color: colors.textPrimary, borderColor: colors.border }]}
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          {/* Payment Mode */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Payment Mode</Text>
            <View style={styles.grid}>
              {PAYMENT_MODES.map((mode) => (
                <TouchableOpacity
                  key={mode}
                  style={[
                    styles.gridItem,
                    { backgroundColor: colors.card, borderColor: colors.border },
                    paymentMode === mode && { backgroundColor: colors.primary, borderColor: colors.primary }
                  ]}
                  onPress={() => {
                    setPaymentMode(mode);
                    if (mode !== 'UPI') setUpiApp('N/A');
                    else setUpiApp('Paytm');
                  }}
                >
                  <Text style={[styles.gridItemText, { color: paymentMode === mode ? '#fff' : colors.textPrimary }]}>{mode}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* UPI App Selection (Only visible if Payment Mode is UPI) */}
          {paymentMode === 'UPI' && (
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>UPI App</Text>
              <View style={styles.grid}>
                {UPI_APPS.map((app) => (
                  <TouchableOpacity
                    key={app}
                    style={[
                      styles.gridItem,
                      { backgroundColor: colors.card, borderColor: colors.border },
                      upiApp === app && { backgroundColor: colors.primary, borderColor: colors.primary }
                    ]}
                    onPress={() => setUpiApp(app)}
                  >
                    <Text style={[styles.gridItemText, { color: upiApp === app ? '#fff' : colors.textPrimary }]}>
                      {UPI_APP_ICONS[app]} {app}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Category */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Category</Text>
            <View style={styles.grid}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.gridItem,
                    { backgroundColor: colors.card, borderColor: colors.border },
                    category === cat && { backgroundColor: colors.primary, borderColor: colors.primary }
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[styles.gridItemText, { color: category === cat ? '#fff' : colors.textPrimary }]}>
                    {CATEGORY_ICONS[cat]} {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 20, paddingBottom: 40 },
  amountContainer: {
    alignItems: 'center', marginVertical: 20, borderRadius: 16, padding: 16, borderWidth: 1,
  },
  amountLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 8 },
  amountInputRow: { flexDirection: 'row', alignItems: 'center' },
  currencySymbol: { fontSize: 36, fontWeight: '800', marginRight: 4 },
  amountInput: { fontSize: 40, fontWeight: '800', minWidth: 120, textAlign: 'center', padding: 0 },
  section: { marginBottom: 20 },
  sectionLabel: { fontSize: 13, fontWeight: '600', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  textInput: { borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, borderWidth: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  gridItem: {
    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, minWidth: '47%', flexGrow: 1, alignItems: 'center',
  },
  gridItemText: { fontSize: 13, fontWeight: '600' },
  saveButton: {
    borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 20,
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

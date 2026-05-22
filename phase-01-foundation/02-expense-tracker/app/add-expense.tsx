import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { CATEGORIES, CATEGORY_ICONS, CATEGORY_COLORS } from '../constants/categories';
import { PAYMENT_MODES, UPI_APPS, UPI_APP_ICONS } from '../constants/paymentModes';
import { Category, PaymentMode, UpiApp, Expense } from '../types/expense';
import { addExpense } from '../utils/storage';
import { generateId, todayISO } from '../utils/formatting';
import { suggestCategory } from '../utils/smartCategory';

export default function AddExpenseScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Food & Dining');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('UPI');
  const [upiApp, setUpiApp] = useState<UpiApp>('Paytm');
  const [date, setDate] = useState(todayISO());
  const [suggestion, setSuggestion] = useState<Category | null>(null);
  const [userPickedCategory, setUserPickedCategory] = useState(false);
  const [lastSuggestedTitle, setLastSuggestedTitle] = useState('');

  const handleTitleChange = (text: string) => {
    setTitle(text);
    if (text.trim().length < 2) {
      setSuggestion(null);
      return;
    }
    if (!userPickedCategory) {
      const suggested = suggestCategory(text);
      if (suggested && suggested !== suggestion) {
        setSuggestion(suggested);
        setLastSuggestedTitle(text);
      } else if (!suggested) {
        setSuggestion(null);
      }
    }
  };

  const handleCategoryPick = (cat: Category) => {
    setCategory(cat);
    setUserPickedCategory(true);
    setSuggestion(null);
  };

  const handleAcceptSuggestion = () => {
    if (suggestion) {
      setCategory(suggestion);
      setUserPickedCategory(true);
      setSuggestion(null);
    }
  };

  const handleDismissSuggestion = () => {
    setSuggestion(null);
    setUserPickedCategory(true);
  };

  const handleSave = async () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0.');
      return;
    }

    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a title or note for this expense.');
      return;
    }

    const newExpense: Expense = {
      id: generateId(),
      title: title.trim(),
      amount: parsedAmount,
      category,
      paymentMode,
      upiApp: paymentMode === 'UPI' ? upiApp : 'N/A',
      date,
      createdAt: new Date().toISOString(),
    };

    try {
      await addExpense(newExpense);
      router.back();
    } catch (e) {
      Alert.alert('Error', 'Failed to save expense. Please try again.');
    }
  };

  const setDateOffset = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    setDate(d.toISOString().split('T')[0]);
  };

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
                autoFocus
              />
            </View>
          </View>

          {/* Title/Note */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Title / Note</Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.card, color: colors.textPrimary, borderColor: colors.border }]}
              value={title}
              onChangeText={handleTitleChange}
              placeholder="e.g. Strepsils, Uber ride, Swiggy..."
              placeholderTextColor={colors.textMuted}
            />
            {/* Smart suggestion chip */}
            {suggestion && !userPickedCategory && (
              <View style={[styles.suggestionCard, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '33' }]}>
                <Text style={styles.suggestionIcon}>✨</Text>
                <View style={styles.suggestionCenter}>
                  <Text style={[styles.suggestionLabel, { color: colors.textMuted }]}>Smart Suggestion</Text>
                  <Text style={[styles.suggestionCat, { color: colors.textPrimary }]}>
                    {CATEGORY_ICONS[suggestion]} {suggestion}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.suggestionBtn, { backgroundColor: CATEGORY_COLORS(colors)[suggestion] + '22', borderColor: CATEGORY_COLORS(colors)[suggestion] + '66' }]}
                  onPress={handleAcceptSuggestion}
                >
                  <Text style={[styles.suggestionBtnText, { color: CATEGORY_COLORS(colors)[suggestion] }]}>Use</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dismissBtn} onPress={handleDismissSuggestion}>
                  <Text style={[styles.dismissBtnText, { color: colors.textMuted }]}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Date Selector */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Date</Text>
            <View style={styles.dateChips}>
              <TouchableOpacity
                style={[
                  styles.dateChip,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  date === todayISO() && { backgroundColor: colors.primary, borderColor: colors.primary }
                ]}
                onPress={() => setDateOffset(0)}
              >
                <Text style={[styles.dateChipText, { color: colors.textSecondary }, date === todayISO() && { color: '#fff' }]}>Today</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.dateChip,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  date === new Date(Date.now() - 86400000).toISOString().split('T')[0] && { backgroundColor: colors.primary, borderColor: colors.primary }
                ]}
                onPress={() => setDateOffset(1)}
              >
                <Text style={[styles.dateChipText, { color: colors.textSecondary }, date === new Date(Date.now() - 86400000).toISOString().split('T')[0] && { color: '#fff' }]}>Yesterday</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={[styles.textInput, { marginTop: 8, backgroundColor: colors.card, color: colors.textPrimary, borderColor: colors.border }]}
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
            <View style={styles.categoryHeader}>
              <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Category</Text>
              {userPickedCategory && (
                <TouchableOpacity onPress={() => { setUserPickedCategory(false); setSuggestion(suggestCategory(title)); }}>
                  <Text style={[styles.resetText, { color: colors.primary }]}>Auto-detect</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.grid}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.gridItem,
                    { backgroundColor: colors.card, borderColor: colors.border },
                    category === cat && { backgroundColor: colors.primary, borderColor: colors.primary }
                  ]}
                  onPress={() => handleCategoryPick(cat)}
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
            <Text style={styles.saveButtonText}>Add Expense</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  amountContainer: {
    alignItems: 'center', marginVertical: 20, borderRadius: 16, padding: 16, borderWidth: 1,
  },
  amountLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 8 },
  amountInputRow: { flexDirection: 'row', alignItems: 'center' },
  currencySymbol: { fontSize: 36, fontWeight: '800', marginRight: 4 },
  amountInput: { fontSize: 40, fontWeight: '800', minWidth: 120, textAlign: 'center', padding: 0 },
  section: { marginBottom: 20 },
  categoryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  resetText: { fontSize: 12, fontWeight: '600' },
  suggestionCard: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 1, padding: 10, marginTop: 8, gap: 8,
  },
  suggestionIcon: { fontSize: 18 },
  suggestionCenter: { flex: 1 },
  suggestionLabel: { fontSize: 10, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 2 },
  suggestionCat: { fontSize: 14, fontWeight: '700' },
  suggestionBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1 },
  suggestionBtnText: { fontSize: 12, fontWeight: '700' },
  dismissBtn: { padding: 4 },
  dismissBtnText: { fontSize: 14, fontWeight: '600' },
  sectionLabel: { fontSize: 13, fontWeight: '600', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  textInput: { borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, borderWidth: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  gridItem: {
    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, minWidth: '47%', flexGrow: 1, alignItems: 'center',
  },
  gridItemText: { fontSize: 13, fontWeight: '600' },
  dateChips: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  dateChip: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1 },
  dateChipText: { fontSize: 12, fontWeight: '600' },
  saveButton: {
    borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 20,
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

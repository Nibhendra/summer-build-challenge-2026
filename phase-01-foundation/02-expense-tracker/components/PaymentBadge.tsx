import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PaymentMode } from '../types/expense';
import { PAYMENT_MODE_COLORS } from '../constants/paymentModes';
import { useTheme } from '../context/ThemeContext';

interface Props {
  mode: PaymentMode;
  size?: 'sm' | 'md';
}

export default function PaymentBadge({ mode, size = 'md' }: Props) {
  const { colors } = useTheme();
  const color = PAYMENT_MODE_COLORS(colors)[mode];
  const small = size === 'sm';
  return (
    <View style={[styles.badge, { backgroundColor: color + '22', borderColor: color + '44' }, small && styles.small]}>
      <Text style={[styles.text, { color }, small && styles.smallText]}>{mode}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  small: {
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  smallText: { fontSize: 10 },
});

import { PaymentMode, UpiApp } from '../types/expense';
import { ThemeColors } from './Colors';

export const PAYMENT_MODES: PaymentMode[] = ['Cash', 'UPI', 'Card', 'Other'];

export const UPI_APPS: UpiApp[] = ['Paytm', 'PhonePe', 'Google Pay', 'BHIM', 'Other'];

export const PAYMENT_MODE_ICONS: Record<PaymentMode, string> = {
  Cash: '💵', UPI: '📱', Card: '💳', Other: '🔄',
};

export const UPI_APP_ICONS: Record<UpiApp, string> = {
  Paytm: '🔵', PhonePe: '🟣', 'Google Pay': '🔵',
  BHIM: '🇮🇳', Other: '📲', 'N/A': '➖',
};

// Theme-aware payment mode colors
export const PAYMENT_MODE_COLORS = (c: ThemeColors): Record<PaymentMode, string> => ({
  Cash:  c.cash,
  UPI:   c.upi,
  Card:  c.payCard,
  Other: c.other,
});

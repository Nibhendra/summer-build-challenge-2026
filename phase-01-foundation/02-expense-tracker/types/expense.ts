export type PaymentMode = 'Cash' | 'UPI' | 'Card' | 'Other';

export type UpiApp = 'Paytm' | 'PhonePe' | 'Google Pay' | 'BHIM' | 'Other' | 'N/A';

export type Category =
  | 'Food & Dining'
  | 'Transport'
  | 'Shopping'
  | 'Entertainment'
  | 'Health'
  | 'Education'
  | 'Utilities'
  | 'Rent'
  | 'Groceries'
  | 'Other';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: Category;
  paymentMode: PaymentMode;
  upiApp: UpiApp;
  date: string; // ISO date string YYYY-MM-DD
  createdAt: string; // ISO datetime string
}

export interface AppSettings {
  monthlyBudget: number;
}
